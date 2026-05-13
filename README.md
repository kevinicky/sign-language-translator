# Sign Language Translator

A real-time web app that detects hand gestures via camera and translates them into English — and vice versa. Think Google Translate for hand signs.

## Features

- **Two-way translation**: Hand Sign ↔ English
- **Sentence Builder**: Chain gestures into full sentences (e.g., "Hello I Love You")
- **Custom word input**: Type names or words not in gesture dictionary
- **ASL Finger Spelling**: Shows how to spell any word letter by letter
- **Adjustable delay**: 1-10 second cooldown between detections (3s default)
- **Real-time hand detection** using MediaPipe Hands
- **Skeleton visualization** with red joint points and green connecting lines
- **12 gesture support** with word mappings
- **Mobile-optimized** for all devices
- **Vercel Analytics** for usage tracking

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

## Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo at [vercel.com](https://vercel.com).

## Modes

1. **💬 Sentence** (default) — Build sentences by detecting gestures, add custom words, see ASL spelling
2. **📷 Detect** — Single gesture detection with translation history
3. **📚 Learn** — Type English text, see how to make the sign with visual guide
4. **📖 Guide** — Browse all supported gestures with descriptions

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

## Sentence Mode

- Detect a gesture → word is auto-added to sentence
- 2-second cooldown prevents duplicate detections
- Type custom words for names (e.g., "Kevin", "Nicky")
- Toggle ASL alphabet to see finger spelling for each letter
- Undo, Clear, and Copy sentence buttons

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **MediaPipe Hands** (browser-based WASM, loaded via CDN)
- **Vercel Analytics**
- **Zero backend** — fully client-side, deploys as static site on Vercel

## License

MIT

© 2025 kevinicky. All rights reserved.
