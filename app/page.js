'use client';

import { useState } from 'react';
import DetectMode from '../components/DetectMode';
import SentenceMode from '../components/SentenceMode';
import LearnMode from '../components/LearnMode';
import GuideMode from '../components/GuideMode';

const TABS = [
  { key: 'sentence', label: '💬 Sentence' },
  { key: 'detect', label: '📷 Detect' },
  { key: 'learn', label: '📚 Learn' },
  { key: 'guide', label: '📖 Guide' }
];

export default function Home() {
  const [mode, setMode] = useState('sentence');

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
        {mode === 'sentence' && <SentenceMode />}
        {mode === 'learn' && <LearnMode />}
        {mode === 'guide' && <GuideMode />}
      </main>

      <footer className="footer">
        <p>© 2025 kevinicky. All rights reserved.</p>
      </footer>
    </div>
  );
}
