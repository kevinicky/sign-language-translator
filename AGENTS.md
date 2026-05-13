# Agent Context - Sign Language Translator

## Project Overview
Two-way sign language translator: detects hand signs → English, and shows how to make signs from English text. Includes sentence builder mode for chaining gestures into full sentences.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18
- **Hand Detection**: MediaPipe Hands (loaded via dynamic import, client-side only)
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel (native Next.js support)

## Architecture
```
sign-language-translator/
├── app/
│   ├── layout.js           # Root layout with metadata + Analytics
│   ├── page.js             # Main page, mode tabs (Sentence is default)
│   └── globals.css         # Global styles
├── components/
│   ├── DetectMode.js       # Camera + hand tracking + recognition
│   ├── SentenceMode.js     # Sentence builder with delay, spelling, custom words
│   ├── LearnMode.js        # Text input → sign visualization
│   └── GuideMode.js        # Static gesture reference grid
├── lib/
│   ├── gestures.js         # Gesture definitions with word mappings, recognition logic
│   └── useHandTracker.js   # React hook for MediaPipe + camera
├── package.json
└── next.config.js
```

## Key Files
- `lib/useHandTracker.js`: Loads MediaPipe via dynamic import, manages camera stream, runs detection loop with requestAnimationFrame
- `lib/gestures.js`: Gesture definitions with word mappings, finger state analysis, recognition logic, CONNECTIONS, FINGER_INDICES
- `components/SentenceMode.js`: Sentence builder with cooldown delay, custom word input, ASL finger spelling display
- `components/DetectMode.js`: Single gesture detection with translation history
- `components/LearnMode.js`: Text search, skeleton pose visualization, quick-select buttons
- `components/GuideMode.js`: Static gesture reference grid

## Modes
1. **💬 Sentence** (default) — Camera → chains gestures into sentences, custom word input, adjustable delay (1-10s, 3s default), ASL finger spelling
2. **📷 Detect** — Camera → single gesture detection with translation history
3. **📚 Learn** — Text input → sign visualization with skeleton
4. **📖 Guide** — Static gesture reference grid

## Gesture → Word Map
| Gesture | Word |
|---------|------|
| 👊 Fist | Hello |
| ☝️ Point Up | I |
| 🖐️ Open Hand | Stop |
| ✌️ Peace | Peace |
| 👍 Thumbs Up | Good |
| 👎 Thumbs Down | Bad |
| 🤙 Shaka | Call |
| 🤟 Love You | Love |
| 🤘 Rock On | Rock |
| 👌 OK | OK |
| 3️⃣ Three | Three |
| 🖖 Four | Four |

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
1. Add entry to `GESTURES` in `lib/gestures.js` with `word` field
2. Add pose coordinates in `components/LearnMode.js` (`GESTURE_POSES` or `curls` mapping)

## Sentence Mode Features
- **Cooldown delay**: Prevents rapid duplicate detections, adjustable 1-10s (default 3s)
- **Custom words**: Type names or words not in gesture dictionary
- **ASL spelling**: Toggle to see finger spelling for each letter A-Z
- **Word chips**: Visual display of each word in the sentence
- **Undo/Clear/Copy**: Sentence management controls
