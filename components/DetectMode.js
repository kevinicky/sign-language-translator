'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import { useHandTracker } from '../lib/useHandTracker';

export default function DetectMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [history, setHistory] = useState([]);
  const lastGestureRef = useRef(null);
  const gestureHistoryRef = useRef([]);
  const autoStartedRef = useRef(false);
  const HISTORY_SIZE = 5;
  const STABILITY_THRESHOLD = 0.6;

  const { result, loading, error, isDetecting, startCamera, stopCamera } = useHandTracker(videoRef, canvasRef);

  const smoothGesture = useCallback((newGesture) => {
    gestureHistoryRef.current.push(newGesture ? newGesture.key : null);
    if (gestureHistoryRef.current.length > HISTORY_SIZE) {
      gestureHistoryRef.current.shift();
    }

    const counts = {};
    for (const g of gestureHistoryRef.current) {
      counts[g] = (counts[g] || 0) + 1;
    }

    let mostCommon = null, maxCount = 0;
    for (const [g, count] of Object.entries(counts)) {
      if (count > maxCount) { maxCount = count; mostCommon = g; }
    }

    return mostCommon && maxCount / gestureHistoryRef.current.length >= STABILITY_THRESHOLD ? mostCommon : lastGestureRef.current;
  }, []);

  useEffect(() => {
    if (result?.gesture) {
      const stable = smoothGesture(result.gesture);
      if (stable && stable !== lastGestureRef.current) {
        lastGestureRef.current = stable;
        const now = new Date().toLocaleTimeString();
        setHistory(prev => [{ icon: result.gesture.icon, name: result.gesture.name, time: now }, ...prev].slice(0, 20));
      }
    } else {
      gestureHistoryRef.current.push(null);
      if (gestureHistoryRef.current.length > HISTORY_SIZE) gestureHistoryRef.current.shift();
      if (!gestureHistoryRef.current.some(g => g !== null)) {
        lastGestureRef.current = null;
      }
    }
  }, [result, smoothGesture]);

  useEffect(() => {
    if (!loading && !error && !isDetecting && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startCamera();
    }
  }, [loading, error, isDetecting, startCamera]);

  const displayGesture = result?.gesture;

  return (
    <div className="mode-section active">
      <div className="video-container">
        <video ref={videoRef} playsInline muted />
        <canvas ref={canvasRef} />
        {loading && !isDetecting && (
          <div className="loading">
            <div className="spinner" />
            <p>Loading hand detection model...</p>
          </div>
        )}
        {error && (
          <div className="error">
            <p>{error}</p>
            <button className="btn" onClick={startCamera}>Retry</button>
          </div>
        )}
      </div>

      <div className="result-panel">
        <div className="gesture-display">
          <span className="gesture-icon">{displayGesture?.icon || '🤚'}</span>
          <span className="gesture-name">{displayGesture?.name || 'No hand detected'}</span>
        </div>
        <p className="gesture-description">
          {displayGesture?.description || 'Show your hand to the camera'}
        </p>
        <div className="confidence-bar">
          <div className="confidence-fill" style={{ width: `${(displayGesture?.confidence || 0) * 100}%` }} />
        </div>
      </div>

      {isDetecting && (
        <button className="btn stop-btn" onClick={stopCamera}>Stop Camera</button>
      )}

      {history.length > 0 && (
        <div className="history-panel">
          <h3>Translation History</h3>
          <div className="history-list">
            {history.map((h, i) => (
              <div key={i} className="history-item">
                <span>{h.icon}</span>
                <span>{h.name}</span>
                <span className="history-time">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
