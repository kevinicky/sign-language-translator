# Agent Context - Sign Language Translator

## Project Overview
Two-way sign language translator: detects hand signs → English, and shows how to make signs from English text.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18
- **Hand Detection**: MediaPipe Hands (loaded via CDN script, client-side only)
- **Deployment**: Vercel (native Next.js support)

## Architecture
```
sign-language-translator/
├── app/
│   ├── layout.js           # Root layout with metadata
│   ├── page.js             # Main page, mode tabs
│   └── globals.css         # Global styles
├── components/
│   ├── DetectMode.js       # Camera + hand tracking + recognition
│   ├── LearnMode.js        # Text input → sign visualization
│   └── GuideMode.js        # Static gesture reference grid
├── lib/
│   ├── gestures.js         # Gesture definitions, recognition logic
│   └── useHandTracker.js   # React hook for MediaPipe + camera
├── package.json
└── next.config.js
```

## Key Files
- `lib/useHandTracker.js`: Loads MediaPipe via dynamic script injection, manages camera stream, runs detection loop with `requestAnimationFrame`
- `lib/gestures.js`: Finger state analysis, gesture matching with confidence scoring
- `components/DetectMode.js`: Uses `useHandTracker` hook, gesture smoothing, translation history
- `components/LearnMode.js`: Text search, skeleton pose visualization, quick-select buttons

## Running Locally
```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to Vercel
```bash
vercel
# Or push to GitHub and connect repo on vercel.com
```

## Adding Gestures
1. Add entry to `GESTURES` in `lib/gestures.js`
2. Add pose coordinates in `components/LearnMode.js` (`GESTURE_POSES` or `curls` mapping)
