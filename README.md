# Snake Game

A mobile-first Snake game built with Next.js 14, TypeScript, Tailwind CSS, and Web Audio API.

**Live:** https://snake.tombas.dev

---

## Stack

- **Next.js 14** — App Router, TypeScript, standalone output
- **Tailwind CSS** — utility-first styling
- **shadcn/ui** — UI primitives (manually integrated)
- **Web Audio API** — retro sound effects, no dependencies
- **PWA** — installable on iOS and Android

---

## Features

- 20×20 grid gameplay
- Mobile swipe + desktop WASD/Arrow key controls
- **Classic mode** — wall collision ends the game
- **Wrap mode** — snake passes through walls
- Separate high scores per mode (localStorage)
- Retro pixel font (Press Start 2P)
- Touch trail animation on mobile
- PWA — installable to home screen with install prompt
- Sound effects: eat, milestone (every 100pts), game over

---

## Architecture

```
app/
├── layout.tsx          # Font, metadata, SW registration
├── page.tsx            # Main composition
└── globals.css         # Tailwind + font variables

components/
├── GameBoard.tsx        # CSS grid renderer
├── GameCell.tsx         # Individual cell (snake/food/empty)
├── GameControls.tsx     # Pause/resume/restart buttons
├── GameOver.tsx         # Game over overlay
├── GameUI.tsx           # Score + best display
├── InstallPrompt.tsx    # PWA install modal (iOS/Android)
├── TouchTrail.tsx       # Canvas-based swipe trail
└── ui/                  # shadcn primitives

hooks/
├── useSnakeGame.ts      # Main game hook (reducer + all input)
├── useGameLoop.ts       # setInterval tick
├── useKeyboard.ts       # WASD + arrow keys
└── useSwipe.ts          # Touch swipe detection

lib/
├── gameEngine.ts        # Pure game logic functions
├── sounds.ts            # Web Audio API sound effects
└── types.ts             # TypeScript types

public/
├── manifest.json        # PWA manifest
├── sw.js                # Service worker
└── icons/               # PWA icons (192, 512, apple-touch)
```

---

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Production build
```

---

## Deployment

Deployed via **Coolify** on `45.87.173.174`.  
Domain: `*.tombas.dev` wildcard DNS → Coolify → Traefik → Let's Encrypt HTTPS.

Trigger redeploy via Coolify API:
```bash
curl -H "Authorization: Bearer <token>" \
  "http://45.87.173.174:8000/api/v1/deploy?uuid=to8kk8k8k0gg800coowgc0g0"
```

---

## Versioning

Version is stored in `package.json` and displayed in the bottom-right corner of the UI.  
Increment on every commit:

| Version | Changes |
|---------|---------|
| 1.3.2   | Mobile viewport centering fix (100svh) |
| 1.3.1   | Real PWA icons + English-only UI |
| 1.3.0   | PWA manifest + install prompt + pixel font fix |
| 1.2.1   | Wrap switch overflow fix |
| 1.2.0   | Wrap mode toggle + separate best scores |
| 1.1.0   | Fake food fix + wrap mode foundation |
| 1.0.4   | iOS audio unlock + food spawn fix |
| 1.0.0   | Initial release |
