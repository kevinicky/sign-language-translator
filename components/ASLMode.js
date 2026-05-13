'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useHandTracker } from '../lib/useHandTracker';
import { recognizeASL, ASL_LETTERS } from '../lib/asl';

export default function ASLMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [word, setWord] = useState('');
  const [lastDetected, setLastDetected] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [delay, setDelay] = useState(3);
  const lastLetterRef = useRef(null);
  const autoStartedRef = useRef(false);

  const { result, loading, error, isDetecting, startCamera, stopCamera } = useHandTracker(videoRef, canvasRef);

  useEffect(() => {
    if (result?.landmarks && result?.handedness && !cooldown) {
      const asl = recognizeASL(result.landmarks, result.handedness);
      if (asl && asl.letter !== lastLetterRef.current) {
        lastLetterRef.current = asl.letter;
        setLastDetected(asl);
        setWord(prev => prev + asl.letter);
        setCooldown(true);
        setTimeout(() => {
          setCooldown(false);
          lastLetterRef.current = null;
        }, delay * 1000);
      }
    }
  }, [result, cooldown, delay]);

  useEffect(() => {
    if (!loading && !error && !isDetecting && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startCamera();
    }
  }, [loading, error, isDetecting, startCamera]);

  function undoLast() {
    setWord(prev => prev.slice(0, -1));
    setLastDetected(null);
  }

  function clearWord() {
    setWord('');
    setLastDetected(null);
    lastLetterRef.current = null;
  }

  function copyWord() {
    navigator.clipboard.writeText(word);
  }

  return (
    <div className="mode-section active">
      <div className="asl-layout">
        <div className="asl-panel">
          <div className="asl-display">
            <div className="asl-word">{word || <span className="asl-placeholder">Detect letters to spell a word...</span>}</div>
            {lastDetected && (
              <div className="asl-last-detected">
                <span className="asl-last-icon">{lastDetected.icon}</span>
                <span className="asl-last-letter">{lastDetected.letter}</span>
                <span className="asl-last-desc">{lastDetected.desc}</span>
              </div>
            )}
            {cooldown && (
              <div className="cooldown-bar">
                <div className="cooldown-fill" style={{ animationDuration: `${delay}s` }} />
              </div>
            )}
          </div>

          <div className="asl-controls">
            <button className="btn btn-small" onClick={undoLast} disabled={!word}>↩ Undo</button>
            <button className="btn btn-small btn-secondary" onClick={clearWord} disabled={!word}>🗑 Clear</button>
            <button className="btn btn-small btn-success" onClick={copyWord} disabled={!word}>📋 Copy</button>
          </div>

          <div className="delay-control">
            <label>Delay: {delay}s</label>
            <input type="range" min="1" max="10" step="0.5" value={delay} onChange={(e) => setDelay(parseFloat(e.target.value))} />
          </div>

          <div className="asl-alphabet-ref">
            <h3>ASL Alphabet Reference</h3>
            <div className="asl-grid">
              {Object.entries(ASL_LETTERS).map(([letter, data]) => (
                <div key={letter} className={`asl-letter-item ${lastDetected?.letter === letter ? 'detected' : ''}`}>
                  <span className="asl-letter-label">{letter}</span>
                  <span className="asl-letter-icon">{data.icon}</span>
                  <span className="asl-letter-desc">{data.desc}</span>
                </div>
              ))}
            </div>
            <p className="asl-note">Note: J and Z require movement tracking and are not supported</p>
          </div>
        </div>

        <div className="camera-panel">
          <div className="video-container">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />
            {loading && !isDetecting && (
              <div className="loading"><div className="spinner" /><p>Loading hand detection...</p></div>
            )}
            {error && (
              <div className="error"><p>{error}</p><button className="btn" onClick={startCamera}>Retry</button></div>
            )}
          </div>
          {isDetecting && <button className="btn stop-btn" onClick={stopCamera}>Stop Camera</button>}
        </div>
      </div>
    </div>
  );
}
