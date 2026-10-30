# Studhive website

A responsive, accessible static website for Students’ Hive, built from the supplied organisation document and brand guidelines. It uses locally hosted Montserrat and Inter, the Studhive palette, and original vector artwork that is explicitly labelled as a placeholder.

All website source files live directly in the `studhive/` repository root. Deployment instructions for Vercel and the Spaceship domain **studhive.org** are in [DEPLOYMENT.md](DEPLOYMENT.md).

## Run locally

Requires Node.js 20 or later. No dependencies or package installation are required.

```bash
npm run dev
```

Open http://localhost:4173. Set `PORT` if another port is needed. The server reads from `dist/`; after editing source, run `npm run build` and refresh.

```bash
npm run build
npm run check
```

## Pages

Home, Who we are, Our programmes, three programme detail pages, Stories & updates, NED 2025 recap, Join the Hive, Contact, Privacy & accessibility, and a custom 404 page.

The mobile navigation, programme and story filters, application information dialog, FAQ disclosures, contact validation, and enquiry draft download all work without a backend. Page content is rendered to HTML at build time and remains readable without JavaScript.

## Add the four missing content groups

Edit **site.config.mjs**, place approved image files in **public/assets/**, then rebuild.

1. `logo.primary` and `logo.reversed`: approved original master artwork. The current header is explicitly a text placeholder. The temporary favicon is an S, not a reproduction of the Hive Mark.
2. `photos`: the hero, fellowship, dialogue, career and gallery images. Use real, approved photos with consent. Gallery entries include `src`, `alt` and `caption`. The hero’s current SVG is an illustration, not a real event photograph.
3. `contact`: official email, phone, office details and social links. Empty values show honest coming-soon labels. Once an email is supplied, the form offers a reviewed `mailto:` draft; it never silently claims delivery.
4. `joinUrl`: the official application or membership destination. Until supplied, the CTA opens programme information and explicitly says applications cannot be submitted through the preview. Dates and recruitment status are not invented.

Add actual image descriptions in **build.mjs** when replacing programme photography. This is a static site: changes are made in the source and rebuilt, not through a CMS.

## Content and launch notes

- Organisation facts and programme copy come from the supplied documents. The NED article is a recap of that source, and the other stories are labelled programme spotlights. There are no invented testimonials, partner logos, impact figures, staff members or recruitment announcements.
- Navigation and story destinations are real local pages. All unconfigured external destinations remain labelled placeholders.
- The contact form sends no network requests and stores no personal information in browser storage. Downloaded drafts are user-controlled files.
- The website has no analytics or third-party scripts. Fonts and artwork are served locally.
- The preview includes `noindex, nofollow` and a disallow-all robots file. For a public launch, supply the missing content and organisational privacy information, confirm imagery and programme details, and change these indexing settings in `build.mjs`.
- `vercel.json` configures `npm run build` and the generated `dist/` output for Vercel. The site address defaults to `https://studhive.org`; an optional `SITE_URL` build environment variable can override it.

## Structure

- `build.mjs`: page content, shared templates, metadata, static generation.
- `site.config.mjs`: organisation settings and missing assets/links.
- `public/styles.css`: responsive visual system.
- `public/app.js`: progressive interactions; no runtime dependencies.
- `public/assets/`: illustration, temporary favicon, local font files and future photos/logos.
- `scripts/check.mjs`: source and built-output validation.
- `server.mjs`: small local preview server.
