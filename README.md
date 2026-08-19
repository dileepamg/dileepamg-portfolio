# dileepamg-portfolio

I'm Dileepa Mahanama Galmangoda, a UI/UX Designer and Creative Generalist from Sri Lanka. Specializing in product design, visual design, and motion to build engaging digital experiences.
My portfolio brings together selected work and a few creative projects I've explored over the years.

This is the codebase behind my personal portfolio website: [https://dileepa.design/](https://dileepa.design/).

---

## Tech Stack

|                 |                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Framework       | [Next.js 16](https://nextjs.org/) (App Router, React 19, React Compiler, Turbopack)                                                  |
| Language        | [TypeScript](https://www.typescriptlang.org/)                                                                                        |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com/)                                                                                          |
| Components      | [shadcn/ui](https://ui.shadcn.com/) on [Radix](https://www.radix-ui.com/) primitives                                                 |
| Motion          | [Motion](https://motion.dev/)                                                                                                        |
| Video           | [next-video](https://next-video.dev/) with [Mux](https://www.mux.com/), played through [media-chrome](https://www.media-chrome.org/) |
| Theming         | [next-themes](https://github.com/pacocoursey/next-themes)                                                                            |
| Analytics       | [Vercel Analytics](https://vercel.com/analytics) and Google Analytics                                                                |
| Structured data | [schema-dts](https://github.com/google/schema-dts)                                                                                   |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dileepamg/dileepamg-portfolio.git
cd dileepamg-portfolio
```

### 2. Install dependencies

```bash
pnpm install
# or npm install / yarn install
```

### 3. Add environment variables

Create a `.env.local` in the project root:

```bash
# Mux, used by next-video to upload and stream the clips in the Fun section.
# Only needed if you are syncing new videos; the site builds without them.
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

# Google Analytics measurement ID. Optional. Analytics is skipped when unset.
NEXT_PUBLIC_GA_ID=
```

### 4. Run the development server

```bash
pnpm dev
# or npm run dev
```

### 5. Open the site locally

Visit:

```
https://localhost:3000
```

`pnpm dev` runs Next over HTTPS, so the first start generates a self-signed certificate into `certificates/` and your browser will ask you to trust it once. If you would rather skip that, `pnpm dev:http` serves plain HTTP on the same port.

Your changes will reload automatically in development.

---

## Scripts

| Script          | What it does                                                                   |
| --------------- | ------------------------------------------------------------------------------ |
| `pnpm dev`      | Dev server over HTTPS, plus a `next-video` watcher that syncs new clips to Mux |
| `pnpm dev:http` | The same thing over plain HTTP                                                 |
| `pnpm build`    | Production build                                                               |
| `pnpm start`    | Serves the production build                                                    |
| `pnpm lint`     | ESLint across the project sources                                              |

---

## Project Structure

```
app/                 Routes, global styles, metadata, sitemap and robots
  work/[slug]/       Case study pages, generated from the case study data
components/
  ui/                shadcn/ui primitives and the site's own shared pieces
  CaseStudy/         Building blocks for a case study page
  WorkSection/       Case study data and the cards on the home page
  structured-data/   JSON-LD for the profile and for each case study
lib/                 Layout constants, site origin, small helpers
media/               Case study imagery
public/              Static files served as is, including the resume PDF
videos/              next-video sources and their Mux manifests
```

Case studies live in [`components/WorkSection/caseStudies.ts`](components/WorkSection/caseStudies.ts). Adding an entry there is enough to produce a card on the home page, a page at `/work/<slug>`, a sitemap entry and its structured data.

---

## Routes

| Route                         | Notes                                                    |
| ----------------------------- | -------------------------------------------------------- |
| `/`                           | Home                                                     |
| `/work/<slug>`                | One page per case study, statically generated            |
| `/resume`                     | Rewrite to the resume PDF, so the address stays readable |
| `/sitemap.xml`, `/robots.txt` | Generated from the case study data                       |

---

## License

This repository includes the source code and structure of my personal portfolio.  
Feel free to clone this project, explore the code (roast it even), and reuse any part of it for your own work, personal or commercial.  
Attribution is appreciated but not required.
