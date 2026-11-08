# ENHYPEN - From Egin To Enhypen

An interactive, fan-made profile website for the K-pop group **ENHYPEN**, built around a gothic "vampire hall" theme: a blood moon over a castle, flickering candles, a floating golden frame, and a door you knock on to step into each member's room.

> This is an unofficial fan project, made for learning and portfolio purposes. It is not affiliated with, endorsed by, or connected to ENHYPEN, BELIFT LAB, or HYBE. All photos, names, and trademarks belong to their respective owners. Non-commercial use only.

## Features

- **Interactive stage**: swipe, drag, click, or use the arrow keys to flip through the group and its six members.
- **Scroll-driven frame**: the golden frame flies, spins, and lands beside the member details as you scroll.
- **Knock on the door**: an arched double door opens into a full-screen room with extra facts and a story section.
- **Living background**: candle flames are detected automatically from the background image and flicker; floating embers and a glowing blood moon sit on top.
- **Member pages**: every member has a shareable page at `/members/<name>` with facts, a framed portrait, and a lazy-loaded YouTube preview behind a door.
- **Voice greeting**: an optional audio pill for each member.
- **Responsive**: a dedicated mobile layout with a large photo on top and scrollable details below.
- **SEO-friendly**: per-page titles, descriptions, and social preview images.

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router, static generation) |
| UI | [React 19](https://react.dev/) (components, hooks) |
| Styling | Plain CSS (CSS variables, 3D transforms, masks, media queries) |
| Graphics | Canvas 2D API (embers, candle flames), inline SVG |
| Animation | CSS animations, Web Animations API, `requestAnimationFrame` |
| Audio | HTML audio element, Web Audio API (synthesized knock sound) |
| Images | WebP, `next/image` |
| Fonts | Google Fonts (Cinzel, Cormorant Garamond) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

Requires [Node.js](https://nodejs.org/) 18.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Other commands:

```bash
npm run build
npm start
```

## Project Structure

```
.
├── app/
│   ├── layout.jsx             root layout, fonts, default metadata
│   ├── page.jsx               home page (renders the stage)
│   ├── globals.css            styles for the member pages
│   ├── icon.png               favicon
│   └── members/
│       ├── layout.jsx         loads member-page styles only on those routes
│       └── [id]/page.jsx      dynamic member page (/members/jake, ...)
├── components/
│   ├── Stage.jsx              home page stage and its state
│   ├── Door.jsx               knock door and the room behind it
│   ├── DoorReveal.jsx         door that reveals a member's video
│   ├── HeadImage.jsx          member head with initial fallback
│   ├── VoicePill.jsx          audio player pill
│   ├── YouTubeLite.jsx        click-to-load YouTube preview
│   ├── Embers.jsx             floating ember particles
│   ├── Flames.jsx             candle flame effect
│   └── stage.css              styles for the home page stage
├── lib/
│   ├── stage.js               flip, drag, and scroll-driven frame animation
│   ├── useDoor.js             door state machine hook
│   ├── useMoon.js             blood moon placement hook
│   └── knockSound.js          synthesized knocking sound
├── data/
│   ├── slides.js              single source of truth for all content
│   └── members.js             member data derived from slides.js
└── public/assets/             photos, background, and logo
```

## Editing Content

All text lives in `data/slides.js`. Each member entry looks like this:

```js
{
  id: "jake",
  mode: "member",
  name: "Jake",
  role: "Member",
  img: "/assets/jake",
  youtube: "",
  lead: "...",
  facts: [["Birth name", "..."], ["Date of birth", "..."]],
  more: { facts: [["Title", "Text"]], story: ["Paragraph 1"] }
}
```

- **YouTube preview**: set `youtube` to a video ID (the part after `v=` in the URL).
- **Room behind the door**: add `more` to replace the placeholder text.
- **Photos**: add `<id>.webp` files to `public/assets/`.
- **Voice greeting**: add `public/assets/voice/<id>.mp3` (`group`, `jungwon`, `jay`, `jake`, `sunghoon`, `sunoo`, `niki`). `.m4a`, `.ogg`, and `.wav` also work.
- **Member head image**: add `public/assets/heads/<id>.png` (shown in front of the door). A circle with the member's initial is used until it exists.

## Architecture Notes

The member pages and most of the home page UI (slide state, details, voice, door, room, embers, flames) are React components driven by state and effects. The flip, drag, and scroll-driven flight of the frame are written imperatively in `lib/stage.js` and started from `Stage.jsx` inside an effect, with full cleanup on unmount.
