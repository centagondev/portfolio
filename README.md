# Centagon — Minimal 3-Page Site

Minimal, premium website for **Centagon**, a software engineering studio.
Three pages — Home, Projects, About — with the black CENTAGON intro, the
blue-silk theme, and the dotted-C logo. No 3D. **"Every Side Matters."**

## Stack

- **React + Vite + TypeScript**
- **React Router** — `/`, `/projects`, `/about` with quick fade/slide transitions
- **Tailwind CSS** — theme tokens in `tailwind.config.js` (the "blue silk" palette)
- **Space Grotesk** (display) + **Inter** (body), self-hosted via Fontsource
- **Framer Motion** — intro, page transitions, scroll reveals, micro-interactions
- **Lenis** — smooth inertial scrolling

## Run it

```bash
npm install
npm run dev
```

Production build & preview:

```bash
npm run build
npm run preview
```

Deploy: import into **Vercel** — zero config (Vite auto-detected). For client-side
routing on static hosts, add a rewrite of all paths to `/index.html`.

## Structure

```
src/
  App.tsx                     # routes, intro gating, page transitions
  pages/
    Home.tsx                  # hero (headline + code window) + values + CTA
    Projects.tsx              # 6 demo project cards
    About.tsx                 # who we are, why Centagon, 12-member team grid
  components/
    Preloader.tsx             # black intro: C assembles, CENTAGON letters rise,
                              # tagline, scale-and-dissolve reveal
    Navbar.tsx                # glass nav, active-route underline, full-screen
                              # mobile menu (Esc, focus, scroll lock)
    Footer.tsx
    PageTransition.tsx        # shared route enter/exit motion
    ProjectCard.tsx           # cover zoom + title slide on hover
    MemberCard.tsx            # the About page's signature box reveal
    ui/                       # Reveal, AnimatedText, Button, CodeWindow,
                              # SectionHeading
  hooks/
    useLenis.ts               # global smooth scroll + getLenis() for route jumps
    usePrefersReducedMotion.ts
```

## Notes

- **Demo data**: team members and projects are placeholders — swap them in
  `src/pages/About.tsx` and `src/pages/Projects.tsx`. Avatars come from
  `i.pravatar.cc` with a gradient-initials fallback if the network blocks them.
- **Reduced motion** is respected everywhere: intro skipped, Lenis disabled,
  reveals render statically.
- Only `transform`/`opacity` are animated; timing is fast and snappy
  (0.25–0.55s). No 3D/WebGL anywhere.
- The intro runs once per browser session (`sessionStorage`), skippable with
  any key/click.
# portfolio
