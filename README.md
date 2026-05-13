# Sign Language Translator

A real-time web app that detects hand gestures via camera and translates them into English — and vice versa. Think Google Translate for hand signs.

## Features

- **Two-way translation**: Hand Sign ↔ English
- **Sentence Builder**: Chain gestures into full sentences (e.g., "Hello I Love You")
- **ASL Finger Spelling**: Real-time A-Z letter detection for spelling any word
- **Custom word input**: Type names or words not in gesture dictionary
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

1. **💬 Sentence** (default) — Build sentences by detecting gestures, add custom words
2. **🔤 ASL** — Real-time ASL finger spelling (A-Z), spell any word letter by letter
3. **📷 Detect** — Single gesture detection with translation history
4. **📚 Learn** — Type English text, see how to make the sign with visual guide
5. **📖 Guide** — Browse all supported gestures with descriptions

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

## ASL Finger Spelling

Supports 22 static letters (A-Z minus J/Z which require movement):

| Letters | Description |
|---------|-------------|
| A, B, C, D, E, F, G, H, I, K, L | Static hand shapes |
| M, N, O, R, S, T, U, V, W, X, Y | Static hand shapes |

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **MediaPipe Hands** (browser-based WASM, loaded via CDN)
- **Vercel Analytics**
- **Zero backend** — fully client-side, deploys as static site on Vercel

## License

MIT

© 2025 kevinicky. All rights reserved.
