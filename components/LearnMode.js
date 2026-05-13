'use client';

import { useState, useRef, useCallback } from 'react';
import { GESTURES, CONNECTIONS } from '../lib/gestures';

const GESTURE_POSES = {
  FIST: [
    {x:0.5,y:0.7},{x:0.45,y:0.6},{x:0.48,y:0.5},{x:0.5,y:0.45},{x:0.52,y:0.42},
    {x:0.35,y:0.55},{x:0.32,y:0.48},{x:0.3,y:0.42},{x:0.32,y:0.38},{x:0.35,y:0.4},
    {x:0.42,y:0.5},{x:0.4,y:0.42},{x:0.38,y:0.36},{x:0.4,y:0.32},{x:0.42,y:0.35},
    {x:0.5,y:0.52},{x:0.48,y:0.44},{x:0.46,y:0.38},{x:0.48,y:0.34},{x:0.5,y:0.36},
    {x:0.58,y:0.55},{x:0.56,y:0.48},{x:0.54,y:0.42},{x:0.56,y:0.38},{x:0.58,y:0.4}
  ],
  OPEN_HAND: [
    {x:0.5,y:0.7},{x:0.45,y:0.6},{x:0.42,y:0.5},{x:0.4,y:0.4},{x:0.38,y:0.3},
    {x:0.35,y:0.55},{x:0.32,y:0.45},{x:0.3,y:0.35},{x:0.28,y:0.25},{x:0.26,y:0.18},
    {x:0.42,y:0.5},{x:0.4,y:0.38},{x:0.38,y:0.28},{x:0.36,y:0.18},{x:0.34,y:0.12},
    {x:0.5,y:0.52},{x:0.48,y:0.4},{x:0.46,y:0.3},{x:0.44,y:0.2},{x:0.42,y:0.14},
    {x:0.58,y:0.55},{x:0.56,y:0.45},{x:0.54,y:0.35},{x:0.52,y:0.25},{x:0.5,y:0.18}
  ]
};

function generatePose(key) {
  if (GESTURE_POSES[key]) return GESTURE_POSES[key];

  const base = GESTURE_POSES.OPEN_HAND.map(j => ({ ...j }));

  const curls = {
    POINT_UP: [[3, {x:0.42,y:0.55}], [4, {x:0.44,y:0.52}], [8, {x:0.3,y:0.35}], [9, {x:0.28,y:0.25}], [10, {x:0.26,y:0.18}], [13, {x:0.48,y:0.55}], [14, {x:0.5,y:0.52}], [15, {x:0.52,y:0.5}], [18, {x:0.56,y:0.55}], [19, {x:0.58,y:0.52}], [20, {x:0.6,y:0.5}]],
    PEACE: [[3, {x:0.42,y:0.55}], [4, {x:0.44,y:0.52}], [13, {x:0.5,y:0.55}], [14, {x:0.52,y:0.52}], [15, {x:0.54,y:0.5}], [18, {x:0.58,y:0.55}], [19, {x:0.6,y:0.52}], [20, {x:0.62,y:0.5}]],
    THUMBS_UP: [[3, {x:0.42,y:0.5}], [4, {x:0.4,y:0.35}]],
    THUMBS_DOWN: [[3, {x:0.42,y:0.55}], [4, {x:0.4,y:0.65}]],
    SHAKA: [[3, {x:0.42,y:0.5}], [4, {x:0.38,y:0.35}], [8, {x:0.32,y:0.52}], [9, {x:0.3,y:0.48}], [10, {x:0.28,y:0.45}], [13, {x:0.4,y:0.52}], [14, {x:0.38,y:0.48}], [15, {x:0.36,y:0.45}]],
    LOVE_YOU: [[8, {x:0.32,y:0.52}], [9, {x:0.3,y:0.48}], [10, {x:0.28,y:0.45}], [13, {x:0.4,y:0.52}], [14, {x:0.38,y:0.48}], [15, {x:0.36,y:0.45}]],
    ROCK_ON: [[3, {x:0.42,y:0.55}], [4, {x:0.44,y:0.52}], [8, {x:0.32,y:0.52}], [9, {x:0.3,y:0.48}], [10, {x:0.28,y:0.45}], [13, {x:0.4,y:0.52}], [14, {x:0.38,y:0.48}], [15, {x:0.36,y:0.45}]],
    OK_SIGN: [[3, {x:0.38,y:0.45}], [4, {x:0.36,y:0.42}], [8, {x:0.38,y:0.45}], [9, {x:0.36,y:0.42}]],
    THREE: [[13, {x:0.5,y:0.55}], [14, {x:0.52,y:0.52}], [15, {x:0.54,y:0.5}], [18, {x:0.58,y:0.55}], [19, {x:0.6,y:0.52}], [20, {x:0.62,y:0.5}]],
    FOUR: [[3, {x:0.48,y:0.6}], [4, {x:0.5,y:0.58}]]
  };

  if (curls[key]) {
    for (const [idx, pos] of curls[key]) {
      base[idx] = pos;
    }
  }

  return base;
}

export default function LearnMode() {
  const [text, setText] = useState('');
  const [selectedGesture, setSelectedGesture] = useState(null);
  const [error, setError] = useState('');
  const canvasRef = useRef(null);

  const drawSign = useCallback((key) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    const joints = generatePose(key).map(j => ({ x: j.x * w, y: j.y * h }));

    for (const [s, e] of CONNECTIONS) {
      ctx.beginPath();
      ctx.moveTo(joints[s].x, joints[s].y);
      ctx.lineTo(joints[e].x, joints[e].y);
      ctx.strokeStyle = '#4ecca3';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    for (let i = 0; i < joints.length; i++) {
      ctx.beginPath();
      ctx.arc(joints[i].x, joints[i].y, 6, 0, 2 * Math.PI);
      ctx.fillStyle = '#e94560';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(joints[i].x, joints[i].y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }, []);

  function searchGesture() {
    const query = text.toLowerCase().trim();
    if (!query) return;

    setError('');

    const match = Object.entries(GESTURES).find(([key, g]) =>
      key.toLowerCase().includes(query) ||
      g.name.toLowerCase().includes(query) ||
      g.english.toLowerCase().includes(query)
    );

    if (match) {
      setSelectedGesture({ key: match[0], ...match[1] });
      drawSign(match[0]);
    } else {
      setError('No matching gesture. Try: ok, peace, fist, thumbs up, love you, rock on, shaka, point, three, four, open hand');
      setSelectedGesture(null);
    }
  }

  function selectGesture(key) {
    const gesture = GESTURES[key];
    setSelectedGesture({ key, ...gesture });
    setText(gesture.name);
    setError('');
    drawSign(key);
  }

  return (
    <div className="mode-section active">
      <div className="text-input-container">
        <h2>Type English → See Sign</h2>
        <div className="input-group">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchGesture()}
            placeholder="Type: ok, peace, fist, thumbs up, love you..."
          />
          <button className="btn" onClick={searchGesture}>Translate</button>
        </div>
        {error && <div className="text-error">{error}</div>}
      </div>

      {selectedGesture && (
        <div className="sign-display">
          <div className="sign-visual">
            <canvas ref={canvasRef} width={300} height={300} />
          </div>
          <div className="sign-info">
            <span className="sign-icon">{selectedGesture.icon}</span>
            <h3>{selectedGesture.name} → {selectedGesture.english}</h3>
            <p>{selectedGesture.description}</p>
            <div className="sign-steps">
              {selectedGesture.steps.map((step, i) => (
                <div key={i} className="step">
                  <span className="step-num">{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="quick-signs">
        <h3>Quick Select</h3>
        <div className="quick-signs-grid">
          {Object.entries(GESTURES).map(([key, gesture]) => (
            <button
              key={key}
              className={`quick-sign-btn ${selectedGesture?.key === key ? 'active' : ''}`}
              onClick={() => selectGesture(key)}
            >
              <span className="qs-icon">{gesture.icon}</span>
              <span className="qs-name">{gesture.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
