'use client';

import { useState } from 'react';
import DetectMode from '../components/DetectMode';
import LearnMode from '../components/LearnMode';
import GuideMode from '../components/GuideMode';

const TABS = [
  { key: 'detect', label: '📷 Detect Sign' },
  { key: 'learn', label: '📚 Learn Sign' },
  { key: 'guide', label: '📖 Gesture Guide' }
];

export default function Home() {
  const [mode, setMode] = useState('detect');

  return (
    <div className="app-container">
      <header className="header">
        <h1>Sign Language Translator</h1>
        <p className="subtitle">Two-way translation: Hand Sign ↔ English</p>
      </header>

      <nav className="mode-tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${mode === tab.key ? 'active' : ''}`}
            onClick={() => setMode(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {mode === 'detect' && <DetectMode />}
        {mode === 'learn' && <LearnMode />}
        {mode === 'guide' && <GuideMode />}
      </main>

      <footer className="footer">
        <p>Powered by MediaPipe Hands | Next.js | Deploy on Vercel</p>
      </footer>
    </div>
  );
}
