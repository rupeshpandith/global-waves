<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Global Waves

**Global Waves** is a React + Vite experience that streams curated global and Indian radio stations on an interactive D3 globe while pairing each listening session with AI-generated visuals from Gemini. The project centralizes live streams, animated controls, and AI image generation into one immersive web app that can run locally or deploy as an async single-page experience.

## Features

- **3D Globe Discovery:** D3-powered orthographic globe with draggable rotation, zoom controls, and glowing station dots that select and highlight live channels.
- **Station Carousel & Cards:** Curated Indian and global stations show real-time metadata (genre, listeners, location) with play/pause buttons, trending badges, and smooth hover interactions.
- **Visual Search:** Smart frequency search filters stations by name, genre, or location and surfaces results below the hero section.
- **Audio Player:** Fixed desktop sidebar/mobile bottom player with playback controls, volume/mute slider, animated album art, and resilient error handling (auto-skip broken streams, report network issues).
- **AI Wallpaper Generator:** Gemini-powered prompt UI that requests station-inspired visuals, supports multiple resolutions, and lets users download the rendered image.
- **Newsletter CTA & Placeholder Links:** Subscription form interactions and CTA placeholders for future privacy/legal/social links.

## Tech Stack

- React 19 + Vite 6 (ES modules, StrictMode)
- D3.js + TopoJSON for globe rendering
- Tailwind CSS (via CDN-plus-config) for glowing neon theme
- `@google/genai` Gemini client for image generation
- TypeScript for typed data models and strong props

## Getting Started

### Prerequisites

- Node.js 20+ (includes npm or pnpm)
- Gemini API key (or run inside AI Studio for automatic key selection)

### Setup

```bash
npm install
```

### Environment Variables

Create or update `.env.local` in the project root:

```dotenv
VITE_GEMINI_API_KEY=your_gemini_key_here
```

> **Important:** Vite exposes only `VITE_` prefixed variables to the browser. `services/geminiService.ts` falls back to `window.aistudio` if available, but `VITE_GEMINI_API_KEY` keeps local dev working. Avoid committing the key.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Launches the Vite dev server (hot reload + AI Studio key detection). |
| `npm run build` | Produces an optimized `dist/` bundle ready for deployment (runs clean every time). |
| `npm run preview` | Serves the production build locally for QA. |

## AI Image Generation Flow

1. The `ImageGenerator` component collects a prompt, selects resolution, and optionally opens the AI Studio key picker (`window.aistudio`).
2. `services/geminiService.ts` ensures a key is available (`VITE_GEMINI_API_KEY`, `process.env.API_KEY`, or Studio picker). It then calls `@google/genai` with `gemini-3-pro-image-preview` to produce inline-encoded PNG data.
3. The UI displays the generated wallpaper, lets users download it, and reports friendly errors if the stream fails.

## Running the Project

```bash
npm run dev
```

Visit `http://localhost:5173` (or the port Vite logs) and interact with the globe, channel cards, AI generator, and newsletter.

## Deployment

1. `npm run build` to create `dist/`.
2. Deploy the `dist/` directory to any static host (Vercel, Netlify, GitHub Pages, etc.).
3. Ensure your deployment process injects the `VITE_GEMINI_API_KEY` secret or uses a server-side proxy for Gemini requests for production security.

## Directory Overview

- `App.tsx` � orchestrates layout, state for current station, search, scrolling, and handles event handlers.
- `components/Globe.tsx` � sets up D3 orthographic globe, drag/zoom, animation loop, and station dots.
- `components/ChannelCard.tsx` � stateless card that shows station info + play button.
- `components/AudioPlayer.tsx` � sticky desktop + mobile player with `<audio>` element, volume, skip, and error handling.
- `components/ImageGenerator.tsx` � UI for Gemini prompts, resolution picker, key selection, and rendered preview.
- `services/geminiService.ts` � wraps Gemini client, checks key availability, and formats the generated PNG string.
- `constants.ts` � station metadata plus navigation link definitions.
- `types.ts` � shared TypeScript interfaces (stations, nav items, image sizes).

## Troubleshooting & Notes

- **Autoplay blocked?** The audio player toggles only after user interaction; clicking the play button once usually resolves `NotAllowedError`.
- **Streams fail to load?** The player will auto-skip; watch the browser console for load errors. You can update `constants.ts` with alternate `streamUrl` values.
- **Gemini errors?** Confirm `VITE_GEMINI_API_KEY` is defined, the key is valid, and `@google/genai` has network access. In Studio, use the `Change API Key` link to reselect.

## Contributing

1. Fork the repo and create a feature branch.
2. Update TypeScript files, keep Tailwind classes tidy, and run `npm run build` to verify.
3. Open a pull request describing the globe/AI behavior changes.

## License

MIT License
