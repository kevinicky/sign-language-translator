import { useEffect, useRef, useState, useCallback } from 'react';
import { recognizeGesture, CONNECTIONS } from './gestures';

export function useHandTracker(videoRef, canvasRef) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handsRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const isActiveRef = useRef(false);

  const drawSkeleton = useCallback((landmarks, canvasW, canvasH) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvasW || !canvasH) return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvasW, canvasH);

    for (const [s, e] of CONNECTIONS) {
      const start = landmarks[s];
      const end = landmarks[e];
      ctx.beginPath();
      ctx.moveTo(start.x * canvasW, start.y * canvasH);
      ctx.lineTo(end.x * canvasW, end.y * canvasH);
      ctx.strokeStyle = '#4ecca3';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    for (let i = 0; i < landmarks.length; i++) {
      const x = landmarks[i].x * canvasW;
      const y = landmarks[i].y * canvasH;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#e94560';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }, [canvasRef]);

  const onResults = useCallback((results) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0];
      const handedness = results.multiHandedness[0].label;

      drawSkeleton(landmarks, canvasW, canvasH);

      const gesture = recognizeGesture(landmarks, handedness);
      setResult({ landmarks, handedness, gesture });
    } else {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvasW, canvasH);
      setResult(null);
    }
  }, [canvasRef, drawSkeleton]);

  useEffect(() => {
    let mounted = true;

    async function initMediaPipe() {
      try {
        // Side-effect import loads the UMD bundle which sets window.Hands
        await import('@mediapipe/hands');

        if (!mounted) return;

        if (typeof window.Hands === 'undefined') {
          throw new Error('MediaPipe Hands not available after import');
        }

        const hands = new window.Hands({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`;
          }
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        hands.onResults(onResults);
        handsRef.current = hands;

        if (mounted) {
          setLoading(false);
        }
      } catch (err) {
        console.error('MediaPipe init error:', err);
        if (mounted) {
          setError(`Failed to load: ${err.message}`);
          setLoading(false);
        }
      }
    }

    initMediaPipe();

    return () => {
      mounted = false;
    };
  }, [onResults]);

  const processFrame = useCallback(async () => {
    const video = videoRef.current;
    const hands = handsRef.current;

    if (!isActiveRef.current || !video || !hands || video.readyState < 2) {
      if (isActiveRef.current) {
        animFrameRef.current = requestAnimationFrame(processFrame);
      }
      return;
    }

    try {
      await hands.send({ image: video });
    } catch (e) {
      console.error('MediaPipe send error:', e);
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoRef]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser not supported.');
      return;
    }

    try {
      setError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });

      streamRef.current = stream;
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await new Promise((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(reject);
          };
          video.onerror = reject;
        });

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
      }

      isActiveRef.current = true;
      setIsDetecting(true);
      animFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found.');
      } else {
        setError(err.message || 'Failed to access camera');
      }
    }
  }, [processFrame]);

  const stopCamera = useCallback(() => {
    isActiveRef.current = false;
    setIsDetecting(false);

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    setResult(null);
  }, [videoRef, canvasRef]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return { result, loading, error, isDetecting, startCamera, stopCamera };
}
