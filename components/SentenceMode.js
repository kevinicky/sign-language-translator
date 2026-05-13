'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { useHandTracker } from '../lib/useHandTracker';
import { GESTURES } from '../lib/gestures';

export default function SentenceMode() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [sentence, setSentence] = useState([]);
  const [customWord, setCustomWord] = useState('');
  const [lastAdded, setLastAdded] = useState(null);
  const [cooldown, setCooldown] = useState(false);
  const [showSpelling, setShowSpelling] = useState(false);
  const [delay, setDelay] = useState(3);
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
    if (result?.gesture && !cooldown) {
      const stable = smoothGesture(result.gesture);
      if (stable && stable !== lastGestureRef.current) {
        lastGestureRef.current = stable;
        const gesture = GESTURES[stable];
        if (gesture) {
          setLastAdded({ word: gesture.word, icon: gesture.icon });
          setSentence(prev => [...prev, gesture.word]);
          setCooldown(true);
          setTimeout(() => {
            setCooldown(false);
            lastGestureRef.current = null;
            gestureHistoryRef.current = [];
          }, delay * 1000);
        }
      }
    } else if (!result?.gesture) {
      gestureHistoryRef.current.push(null);
      if (gestureHistoryRef.current.length > HISTORY_SIZE) gestureHistoryRef.current.shift();
      if (!gestureHistoryRef.current.some(g => g !== null)) {
        lastGestureRef.current = null;
      }
    }
  }, [result, smoothGesture, cooldown]);

  useEffect(() => {
    if (!loading && !error && !isDetecting && !autoStartedRef.current) {
      autoStartedRef.current = true;
      startCamera();
    }
  }, [loading, error, isDetecting, startCamera]);

  useEffect(() => {
    if (lastAdded) {
      const timer = setTimeout(() => setLastAdded(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAdded]);

  const ASL_ALPHABET = {
    A: { icon: '🅰️', desc: 'Fist with thumb on side' },
    B: { icon: '🅱️', desc: 'Four fingers up, thumb tucked' },
    C: { icon: '©️', desc: 'Curved hand like a C' },
    D: { icon: '🇩', desc: 'Index up, other fingers curled to thumb' },
    E: { icon: '🇪', desc: 'Fingers curled, thumb tucked under' },
    F: { icon: '🇫', desc: 'OK sign with other fingers up' },
    G: { icon: '🇬', desc: 'Point sideways with index' },
    H: { icon: '🇭', desc: 'Index and middle pointing sideways' },
    I: { icon: '🇮', desc: 'Pinky up, fist closed' },
    J: { icon: '🇯', desc: 'I sign, move pinky in J shape' },
    K: { icon: '🇰', desc: 'Index and middle up in V, thumb between' },
    L: { icon: '🇱', desc: 'L shape with index and thumb' },
    M: { icon: '🇲', desc: 'Three fingers over thumb in fist' },
    N: { icon: '🇳', desc: 'Two fingers over thumb in fist' },
    O: { icon: '🇴', desc: 'All fingers curved to thumb, O shape' },
    P: { icon: '🇵', desc: 'K sign pointing down' },
    Q: { icon: '🇶', desc: 'G sign pointing down' },
    R: { icon: '🇷', desc: 'Cross index and middle fingers' },
    S: { icon: '🇸', desc: 'Fist with thumb over fingers' },
    T: { icon: '🇹', desc: 'Thumb between index and middle' },
    U: { icon: '🇺', desc: 'Index and middle up together' },
    V: { icon: '✌️', desc: 'Index and middle in V shape' },
    W: { icon: '🇼', desc: 'Index, middle, ring up spread' },
    X: { icon: '🇽', desc: 'Index finger hooked' },
    Y: { icon: '🤙', desc: 'Thumb and pinky out' },
    Z: { icon: '🇿', desc: 'Index finger draws Z in air' }
  };

  function getSpelling(word) {
    return word.toUpperCase().split('').map(letter => ({
      letter,
      ...ASL_ALPHABET[letter]
    })).filter(s => s.icon);
  }

  function addCustomWord() {
    const word = customWord.trim();
    if (word) {
      setSentence(prev => [...prev, word]);
      setLastAdded({ word, icon: '✏️' });
      setCustomWord('');
    }
  }

  function undoLast() {
    setSentence(prev => prev.slice(0, -1));
    setLastAdded(null);
  }

  function clearSentence() {
    setSentence([]);
    setLastAdded(null);
  }

  function copySentence() {
    const text = sentence.join(' ');
    navigator.clipboard.writeText(text);
    setLastAdded({ word: 'Copied!', icon: '📋' });
  }

  const fullSentence = sentence.join(' ');

  return (
    <div className="mode-section active">
      <div className="sentence-layout">
        <div className="sentence-panel">
          <div className="sentence-display">
            <div className="sentence-text">
              {fullSentence || (
                <span className="sentence-placeholder">
                  Detect gestures or type words to build a sentence...
                </span>
              )}
            </div>
            {lastAdded && (
              <div className="word-added">
                <span>{lastAdded.icon}</span>
                <span>Added: {lastAdded.word}</span>
              </div>
            )}
            {cooldown && (
              <div className="cooldown-bar">
                <div className="cooldown-fill" style={{ animationDuration: `${delay}s` }} />
              </div>
            )}
          </div>

          {sentence.length > 0 && (
            <div className="word-chips">
              {sentence.map((word, i) => (
                <span key={i} className="word-chip">{word}</span>
              ))}
            </div>
          )}

          <div className="sentence-controls">
            <button className="btn btn-small" onClick={undoLast} disabled={sentence.length === 0}>
              ↩ Undo
            </button>
            <button className="btn btn-small btn-secondary" onClick={clearSentence} disabled={sentence.length === 0}>
              🗑 Clear
            </button>
            <button className="btn btn-small btn-success" onClick={copySentence} disabled={sentence.length === 0}>
              📋 Copy
            </button>
          </div>

          <div className="custom-word-input">
            <input
              type="text"
              value={customWord}
              onChange={(e) => setCustomWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustomWord()}
              placeholder="Type a word (name, place, etc.)"
            />
            <button className="btn" onClick={addCustomWord}>Add</button>
          </div>

          <div className="delay-control">
            <label>Delay: {delay}s</label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={delay}
              onChange={(e) => setDelay(parseFloat(e.target.value))}
            />
          </div>

          <button
            className="btn btn-small btn-toggle"
            onClick={() => setShowSpelling(!showSpelling)}
          >
            {showSpelling ? '🔤 Hide Spelling' : '🔤 Show Spelling'}
          </button>

          {showSpelling && (
            <div className="spelling-panel">
              <h3>Finger Spelling (ASL Alphabet)</h3>
              <div className="spelling-grid">
                {Object.entries(ASL_ALPHABET).map(([letter, data]) => (
                  <div key={letter} className="spelling-item">
                    <span className="spelling-letter">{letter}</span>
                    <span className="spelling-icon">{data.icon}</span>
                    <span className="spelling-desc">{data.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sentence.length > 0 && (
            <div className="spelling-result">
              <h3>How to spell your sentence:</h3>
              {sentence.map((word, wi) => {
                const spelling = getSpelling(word);
                return (
                  <div key={wi} className="word-spelling">
                    <span className="spelling-word-label">{word}:</span>
                    <div className="letter-spell">
                      {spelling.map((s, i) => (
                        <span key={i} className="letter-item" title={s.desc}>
                          {s.icon}
                          <span className="letter-label">{s.letter}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="camera-panel">
          <div className="video-container">
            <video ref={videoRef} playsInline muted />
            <canvas ref={canvasRef} />
            {loading && !isDetecting && (
              <div className="loading">
                <div className="spinner" />
                <p>Loading hand detection...</p>
              </div>
            )}
            {error && (
              <div className="error">
                <p>{error}</p>
                <button className="btn" onClick={startCamera}>Retry</button>
              </div>
            )}
          </div>

          <div className="gesture-hints">
            <h3>Gesture → Word</h3>
            <div className="hints-grid">
              {Object.entries(GESTURES).map(([key, gesture]) => (
                <div key={key} className="hint-item">
                  <span className="hint-icon">{gesture.icon}</span>
                  <span className="hint-word">{gesture.word}</span>
                </div>
              ))}
            </div>
          </div>

          {isDetecting && (
            <button className="btn stop-btn" onClick={stopCamera}>Stop Camera</button>
          )}
        </div>
      </div>
    </div>
  );
}
