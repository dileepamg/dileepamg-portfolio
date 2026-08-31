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
| CMS             | [Sanity](https://www.sanity.io/) via [next-sanity](https://github.com/sanity-io/next-sanity) (live content, draft mode, Studio)       |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com/)                                                                                          |
| Components      | [shadcn/ui](https://ui.shadcn.com/) on [Radix](https://www.radix-ui.com/) primitives                                                 |
| 3D              | [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), Rapier physics (profile lanyard)                                        |
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
```

### 3. Add environment variables

Copy `.env.example` to `.env.local` and fill in what you need:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Yes | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Yes | Sanity dataset (e.g. `production`) |
| `SANITY_API_READ_TOKEN` | Preview only | Server token for draft previews and live content with drafts. Use a **Viewer** token. |
| `SANITY_API_WRITE_TOKEN` | Local scripts only | Editor token for migration/seed scripts. **Never deploy this.** |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics measurement ID |
| `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` | No | Only needed when syncing new motion clips via `next-video` |

The site builds and serves published content with only the public Sanity env vars. Draft previews need `SANITY_API_READ_TOKEN`.

### 4. Run the development server

```bash
pnpm dev
```

For plain HTTP instead of the default HTTPS dev server:

```bash
pnpm dev:http
```

### 5. Open locally

```
https://localhost:3000      # website
https://localhost:3000/studio   # Sanity Studio (requires Sanity login)
```

`pnpm dev` runs Next over HTTPS and generates a self-signed certificate in `certificates/` on first start.

---

## Scripts

| Script | What it does |
| ------ | ------------ |
| `pnpm dev` | Dev server over HTTPS + `next-video` watcher |
| `pnpm dev:http` | Dev server over HTTP + `next-video` watcher |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |
| `pnpm sanity:schema` | Extract Sanity schema to `sanity/schema.json` |
| `pnpm sanity:typegen` | Generate types from schema + GROQ queries |
| `pnpm sanity:validate` | Validate Sanity schema |
| `pnpm sanity:migrate:check` | Dry-run content migration |
| `pnpm sanity:migrate` | Import legacy content into Sanity |
| `pnpm sanity:seed:blog` | Seed/update the Crisis Portal blog post |
| `pnpm sanity:seed:srilankanism` | Seed/update the SriLankanism blog post |

---

## Project Structure

```
app/
  (website)/           Public site routes
    page.tsx           Home
    blog/              Blog index and posts
    work/[slug]/       Case study pages
    resume/route.ts    Resume PDF proxy from Sanity
    api/draft-mode/    Draft preview enable route
  (studio)/studio/     Embedded Sanity Studio
  layout.tsx           Root layout shell
  globals.css          Theme tokens and global styles
  sitemap.ts, robots.ts

components/
  Blog/                Blog cards, portable text renderer
  CaseStudy/           Case study page building blocks
  WorkSection/         Work section UI
  loading/             Route skeletons
  structured-data/     JSON-LD helpers
  ui/                  shadcn/ui and shared UI

sanity/
  schemaTypes/         Content schemas (posts, case studies, settings, …)
  lib/                 Sanity client, queries, mappers, live preview
  structure.ts         Studio desk structure

scripts/               One-off migration and blog seed scripts
lib/                   Layout constants, reading time, site helpers
public/                Static assets (lanyard model, OG image, …)
videos/                next-video sources and Mux manifests
```

Content flows from Sanity → typed GROQ queries in `sanity/lib/queries.ts` → mappers in `sanity/lib/mappers.ts` → React components.

---

## Routes

| Route | Notes |
| ----- | ----- |
| `/` | Home |
| `/blog` | Blog index |
| `/blog/<slug>` | Blog post |
| `/work/<slug>` | Case study |
| `/resume` | Resume PDF (proxied from Sanity file asset) |
| `/studio` | Sanity Studio (authenticated via Sanity) |
| `/api/draft-mode/enable` | Draft preview entry point (Sanity-validated) |
| `/sitemap.xml`, `/robots.txt` | Generated from Sanity content |

`/studio/` and `/api/draft-mode/` are disallowed in `robots.txt`.

---

## Content Editing

1. Sign in at `/studio` with your Sanity account.
2. Edit site settings, home page copy, case studies, experience, blog posts, and motion items.
3. Use **Presentation** in Studio for live preview (requires `SANITY_API_READ_TOKEN` in `.env.local`).
4. Publish documents to make changes live on the public site.

Blog posts support rich text, images, callouts, code blocks, and timeline blocks.

---

## Security

The site follows Sanity’s recommended patterns for draft mode, live preview, and published content separation.

**Reviewed controls**

- Draft mode is enabled only through Sanity’s validated preview URL flow (`/api/draft-mode/enable` returns 401 without a valid secret).
- `SANITY_API_READ_TOKEN` is sent to the browser only during draft mode, not on normal published traffic.
- GROQ queries use parameterized slugs; portable text renders through React (no raw HTML sink).
- Remote images are restricted to `cdn.sanity.io`.
- `.env*` files are gitignored; `.env.example` contains no secrets.
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`) are set in `next.config.ts`.

**Operational notes**

- Use a **Viewer-only** read token for previews. Never deploy `SANITY_API_WRITE_TOKEN`.
- Treat Studio preview URLs as confidential; rotate the read token if one leaks.
- CMS link fields are editor-trusted. Hardening with runtime URL allowlists is optional defense-in-depth.

A full branch security review found **no medium, high, or critical issues** exploitable by unauthenticated external attackers in the current Sanity migration.

---

## License

This repository includes the source code and structure of my personal portfolio.  
Feel free to clone this project, explore the code (roast it even), and reuse any part of it for your own work, personal or commercial.  
Attribution is appreciated but not required.
