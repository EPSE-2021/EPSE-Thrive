# E-Connect Youth

**Mental Health Coordination Platform — Prototype**

> All names, referral IDs, providers, and data shown in this app are entirely fictional placeholder content. No real personal health information is collected or stored.

---

## Quick Start (local)

```bash
npm install
npm run dev        # → http://localhost:3000
```

## Build & Deploy

```bash
npm run build      # outputs to /dist
npm run preview    # preview the production build locally
```

## Deploy to GitHub Pages

1. Push this repo to GitHub
2. Go to **Settings → Pages → Source** → select **"GitHub Actions"**
3. Push any commit to `main` — the workflow deploys automatically

**Before deploying**, open `vite.config.js` and set `REPO_NAME` to match your repository name:

```js
// vite.config.js  (line 11)
const REPO_NAME = "/your-repo-name-here";
```

Your live URL will be: `https://YOUR_USERNAME.github.io/your-repo-name/`

---

## Project Structure

```
econnect-youth/
├── index.html                    ← HTML shell (fonts, meta, root div)
├── package.json                  ← Dependencies + scripts
├── vite.config.js                ← Vite + GitHub Pages base path
├── tailwind.config.js            ← Design tokens as Tailwind theme
├── postcss.config.js             ← PostCSS (Tailwind + Autoprefixer)
├── .gitignore
├── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml            ← Auto-deploy to GitHub Pages on push
├── public/
│   └── favicon.svg               ← SVG favicon
└── src/
    ├── main.jsx                  ← React entry point
    ├── index.css                 ← Global styles + CSS design tokens
    └── App.jsx                   ← All pages, components, and logic
```

---

## Role Switcher

| Role | View |
|------|------|
| 🌱 Youth | Wellness check-ins, mood tracking, secure messaging |
| 🏡 Parent | Support request, referral tracking, consent management |
| 🏫 School | FERPA-aware referral form |
| 🩺 Provider | Referral queue, scheduling, caseload |
| 🔗 Admin | Case queue, provider matching, analytics |

---

## Tech Stack

- **React 18** — UI library
- **Vite 5** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first CSS
- **CSS Custom Properties** — Design tokens (colors, radii, shadows)
- **Nunito + Lora** — Google Fonts

## Accessibility

- WCAG AA/AAA contrast throughout
- Visible 3px focus ring on all interactive elements
- Skip navigation link
- `aria-*` attributes on all controls
- Minimum 44px touch targets
- Reduced-motion support

---

*EPSE Enterprises LLC — Birmingham, Alabama — [epse2021.org](https://www.epse2021.org)*
