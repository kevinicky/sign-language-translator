# Agent Context - Sign Language Translator

## Project Overview
Two-way sign language translator: detects hand signs → English, shows how to make signs from English text, and supports ASL finger spelling (A-Z).

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
│   ├── ASLMode.js          # Real-time ASL finger spelling (A-Z)
│   ├── LearnMode.js        # Text input → sign visualization
│   └── GuideMode.js        # Static gesture reference grid
├── lib/
│   ├── gestures.js         # Gesture definitions with word mappings, recognition logic
│   ├── asl.js              # ASL alphabet (22 letters) recognition logic
│   └── useHandTracker.js   # React hook for MediaPipe + camera
├── package.json
└── next.config.js
```

## Key Files
- `lib/useHandTracker.js`: Loads MediaPipe via dynamic import, manages camera stream, runs detection loop
- `lib/gestures.js`: 12 gesture definitions with word mappings, finger state analysis
- `lib/asl.js`: 22 ASL letter definitions (A-Z minus J/Z), recognition via hand shape analysis
- `components/SentenceMode.js`: Sentence builder with cooldown delay, custom word input
- `components/ASLMode.js`: Real-time ASL finger spelling, alphabet reference grid
- `components/DetectMode.js`: Single gesture detection with translation history
- `components/LearnMode.js`: Text search, skeleton pose visualization
- `components/GuideMode.js`: Static gesture reference grid

## Modes
1. **💬 Sentence** (default) — Chains gestures into sentences, custom word input, adjustable delay (1-10s, 3s default)
2. **🔤 ASL** — Real-time ASL finger spelling (22 letters), spells words letter by letter
3. **📷 Detect** — Single gesture detection with translation history
4. **📚 Learn** — Text input → sign visualization with skeleton
5. **📖 Guide** — Static gesture reference grid

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

## ASL Letters Supported
A, B, C, D, E, F, G, H, I, K, L, M, N, O, R, S, T, U, V, W, X, Y (22 letters)
Excluded: J, Z (require movement tracking)

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

## Adding ASL Letters
1. Add entry to `ASL_LETTERS` in `lib/asl.js`
2. Define `check(landmarks, handedness)` function returning boolean
3. Use `isExtended()`, `isCurled()`, `distance()` helpers
