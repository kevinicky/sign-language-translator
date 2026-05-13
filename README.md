# Sign Language Translator

A real-time web app that detects hand gestures via camera and translates them into English — and vice versa. Think Google Translate for hand signs.

## Features

- **Two-way translation**: Hand Sign → English AND English → Hand Sign
- **Real-time hand detection** using MediaPipe Hands
- **Skeleton visualization** with red joint points and green connecting lines
- **12 gesture support**: Fist, Peace, Thumbs Up/Down, Shaka, Love You, Rock On, OK, and more
- **Translation history** tracking
- **Mobile-optimized** for all devices

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

1. **📷 Detect Sign** — Show your hand to camera, see it translated to English
2. **📚 Learn Sign** — Type English text, see how to make the sign with visual guide
3. **📖 Gesture Guide** — Browse all supported gestures with descriptions

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **MediaPipe Hands** (browser-based WASM, loaded via CDN)
- **Zero backend** — fully client-side, deploys as static site on Vercel

## License

MIT
