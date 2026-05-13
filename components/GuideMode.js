'use client';

import { GESTURES } from '../lib/gestures';

export default function GuideMode() {
  return (
    <div className="mode-section active">
      <h2 className="guide-title">Complete Gesture Guide</h2>
      <div className="guide-grid">
        {Object.entries(GESTURES).map(([key, gesture]) => (
          <div key={key} className="guide-card">
            <span className="guide-icon">{gesture.icon}</span>
            <h3>{gesture.name}</h3>
            <p className="guide-english">{gesture.english}</p>
            <p className="guide-desc">{gesture.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
