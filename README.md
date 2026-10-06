# Fresh & Good

A storefront website for **Fresh & Good**, a Kochi brand of homemade Kerala food — banana chips, stone-ground masalas, fresh produce, seafood and breakfast staples — sold through neighbourhood partner shops rather than online.

Visitors browse the catalogue, see which shops stock a product, and find the nearest one on a map. There is no cart or checkout: the site's job is to get people to a shop.

## Features

- **Catalogue**: categories, product listing with filters (category, price, veg / non-veg, tags) and sorting kept in the URL, and product pages with an image gallery, ingredients and shelf life.
- **Search**: typo-tolerant search (Fuse.js) with an autocomplete dropdown in the header (full-screen on mobile), the home hero and the 404 page, and a results page with All / Products / Categories tabs and "Did you mean…?" suggestions.
- **Find a Shop**: an OpenStreetMap map (Leaflet) with every partner shop; search by area, pincode or name; filter by category or product (e.g. `/shops?product=banana-chips`); opening hours, phone links and Google Maps directions.
- **Location, privately**: "Use my location" sorts shops by distance. Location is requested only on a click, kept in the browser for the session, and never sent anywhere.
- **Product availability**: each product page lists the shops that stock it, nearest first once location is shared, with a small map.
- **About and Contact**: an About page driven by one content file, and a contact form (react-hook-form + zod) delivered by Web3Forms, with spam protection and a fallback to email and WhatsApp links.
- **SEO**: per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards; JSON-LD for the organisation, products, shops and breadcrumbs; a generated `sitemap.xml` and `robots.txt`; favicons and a web app manifest.
- **Accessible and fast**: keyboard support throughout, ARIA combobox / tabs / dialog patterns, announced form errors, a skip link, and lazy-loaded routes, maps, search index and images.

## Tech stack

| Area          | Tools                                                                    |
| ------------- | ------------------------------------------------------------------------ |
| Framework     | React 19, TypeScript, Vite                                               |
| Styling       | Tailwind CSS v4 (brand tokens in `src/index.css`), clsx, tailwind-merge  |
| Routing & SEO | React Router, react-helmet-async                                         |
| Maps          | Leaflet, react-leaflet, OpenStreetMap tiles                              |
| Search        | Fuse.js                                                                  |
| Forms         | react-hook-form, zod, @hookform/resolvers, Web3Forms                     |
| Icons         | lucide-react                                                             |
| Quality       | ESLint (flat config), Prettier (with Tailwind class sorting), TypeScript |

## Getting started

Requires **Node.js 22.18 or newer** (the sitemap script uses Node's built-in TypeScript support).

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:5173
```

The site runs without a `.env.local`, using placeholder values.

## Environment variables

Set these in `.env.local` for local development, and in your host's project settings for production. Only variables starting with `VITE_` are used, and they all end up in the public JavaScript, so never put secrets in them.

| Variable                     | Required?   | What it does                                                                                                                                                                                                                                     |
| ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_SITE_URL`              | Recommended | The public address of the site, without a trailing slash, e.g. `https://freshandgood.in`. Used for canonical links, social share previews, `sitemap.xml` and `robots.txt`. Defaults to a placeholder domain.                                     |
| `VITE_WHATSAPP_NUMBER`       | Optional    | WhatsApp number for the chat buttons, digits only with country code, e.g. `919876543210`. Overrides the number in `src/data/siteConfig.ts`.                                                                                                      |
| `VITE_CONTACT_FORM_ENDPOINT` | Optional    | Where the contact form posts. For Web3Forms this is `https://api.web3forms.com/submit`.                                                                                                                                                          |
| `VITE_CONTACT_FORM_KEY`      | Optional    | Your Web3Forms access key. Get one free at [web3forms.com](https://web3forms.com) by entering the email address that should receive messages. Without it (or the endpoint), the Contact page shows email and WhatsApp links instead of the form. |

After changing environment variables, restart `npm run dev` or rebuild.

## Editing content

All content lives in `src/data/`. Edit the files, save, and the site updates (in development) or picks the changes up on the next build. Components never import these files directly; they go through `src/services/`, and ESLint enforces that.

In development, the browser console reports data problems such as duplicate IDs or a product pointing at a shop that doesn't exist.

### Business and contact details — `src/data/siteConfig.ts`

Name, tagline, description, phone, email, WhatsApp number, office address, office map location (`coordinates`) and office hours. These appear in the header, footer, WhatsApp button, Contact page and search-engine data, so this is the only place to change them.

### About page — `src/data/about.ts`

Every piece of text on the About page: the hero, story paragraphs, mission, value cards, "How it works" steps, team members and the closing call to action. Value-card `icon`s are names from a fixed list (see `AboutValueIcon` in `src/types/index.ts`). For team photos, put the image in `public/images/team/` and set `photo: '/images/team/athulya.jpg'`; without a photo, the person's initials are shown.

### Categories — `src/data/categories.ts`

Each category needs a unique `id` and `slug` (the slug is the URL: `/category/<slug>`), a `name`, `malayalamName`, `description`, an `emoji` and an `image`.

### Products — `src/data/products.ts`

```ts
{
  id: 'prd-banana-chips',          // unique, never shown
  slug: 'banana-chips',            // URL: /product/banana-chips (lowercase, hyphens)
  name: 'Banana Chips',
  malayalamName: 'ഉപ്പേരി',
  categoryId: 'cat-snacks',        // must match a category id
  description: '…',
  price: 120,                      // rupees
  unit: '250 g',
  isVeg: true,
  origin: 'Kozhikode',
  tags: ['chips', 'snack', 'coconut oil'],   // used by filters and search
  isFeatured: true,                // shown on the home page
  emoji: '🍌',
  images: gallery('banana-chips'), // or a list of paths, see below
  ingredients: ['Nendran banana', 'Coconut oil', 'Salt'],
  shelfLife: '2 months in an airtight container',
  shopIds: at('edappally', 'kakkanad'),      // shops that stock it, or ALL_SHOPS
}
```

`at(...)` takes shop keys (the part of the shop `id` after `shop-`), and a typo fails the type check.

### Shops — `src/data/shops.ts`

Each shop has an `id` (`shop-<key>`), `slug`, `name`, `area`, `address`, `city`, `pincode`, `phone`, `coordinates` and `hours`. To find coordinates, right-click the shop in Google Maps and click the numbers at the top of the menu to copy them (`lat, lng`). Hours use 24-hour `"HH:mm"`, and `closedOn` lists days such as `['sun']`. When you add a shop, also add its key to the `ShopKey` list at the top of `products.ts`.

### Product images

Images live in `public/images/`. The seed data currently uses placeholder SVGs.

1. Save photos as `public/images/products/<slug>-1.jpg`, `-2.jpg` and so on. A 4:3 or square crop about 1200 px wide works well. Compress them first (for example with [Squoosh](https://squoosh.app)) and aim for under 200 KB each, ideally as `.webp`.
2. In `products.ts`, replace `gallery('<slug>')` with the real paths, e.g. `images: ['/images/products/banana-chips-1.webp', '/images/products/banana-chips-2.webp']`. The first image is the main one.
3. Category banners work the same way, in `public/images/categories/` and the category's `image` field.

Images are lazy-loaded, keep their space while loading, and fall back to `/images/fallback.svg` if a file is missing. Real (non-SVG) product photos are also used for social share previews.

### Icons and share image

`public/` holds `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest` and `og-image.png` (1200×630, used when a link is shared on WhatsApp, Facebook, X and so on). Replace them with files of the same names and sizes to rebrand.

## Scripts

| Command                | What it does                                                          |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Start the dev server                                                  |
| `npm run build`        | Generate the sitemap and robots.txt, type-check, and build to `dist/` |
| `npm run preview`      | Serve the production build locally (run `npm run build` first)        |
| `npm run sitemap`      | Regenerate `public/sitemap.xml` and `public/robots.txt` only          |
| `npm run lint`         | Run ESLint                                                            |
| `npm run lint:fix`     | Run ESLint and fix what it can                                        |
| `npm run format`       | Format everything with Prettier                                       |
| `npm run format:check` | Check formatting without changing files                               |
| `npm run typecheck`    | Type-check only                                                       |

`sitemap.xml` and `robots.txt` are generated on every build from the seed data and `VITE_SITE_URL`, so they aren't committed.

## Project structure

```
├── public/                  # Static files: icons, og-image, manifest, images, _redirects
├── scripts/
│   ├── generate-sitemap.ts  # Writes sitemap.xml + robots.txt (runs before every build)
│   └── siteUrl.ts           # Resolves VITE_SITE_URL for the build and the sitemap
├── src/
│   ├── App.tsx              # Providers and routes (each page is lazy-loaded)
│   ├── main.tsx             # Entry point
│   ├── index.css            # Tailwind, brand colours, map marker styles
│   ├── components/
│   │   ├── category/        # Category cards, grid and compact links
│   │   ├── contact/         # Contact form and its validation schema
│   │   ├── home/            # Hero, "Why choose us", nearby shops, testimonials
│   │   ├── layout/          # Header, footer, layout, logo, WhatsApp button
│   │   ├── product/         # Product cards, grid, filters, gallery, availability
│   │   ├── search/          # SearchBar (autocomplete), mobile overlay, highlighting
│   │   ├── seo/             # Seo (meta tags), JsonLd, structured-data builders
│   │   ├── shop/            # Shop card, location prompt, map (lazy-loaded)
│   │   └── ui/              # Buttons, inputs, cards, drawer, combobox and other basics
│   ├── config/site.ts       # Site config (data + env), nav links, link helpers
│   ├── context/             # Shared user-location state
│   ├── data/                # ✏️ All editable content (see "Editing content")
│   ├── hooks/               # useAsync, useSearch, useGeolocation, useProductFilters…
│   ├── pages/               # One file per route
│   ├── services/            # The only code that reads src/data
│   ├── types/               # Shared TypeScript types
│   └── utils/               # Formatting, distance, directions, routes, filtering
├── netlify.toml / vercel.json
└── .env.example
```

### Routes

| Path              | Page                                                  |
| ----------------- | ----------------------------------------------------- |
| `/`               | Home                                                  |
| `/categories`     | All categories                                        |
| `/category/:slug` | One category's products                               |
| `/products`       | All products, with filters                            |
| `/product/:slug`  | Product detail and where to buy                       |
| `/shops`          | Find a Shop (`?q=`, `?category=`, `?product=`)        |
| `/search?q=`      | Search results (`?tab=products` or `?tab=categories`) |
| `/about`          | About                                                 |
| `/contact`        | Contact                                               |
| anything else     | 404 page with search                                  |

## Deployment

The site is a static single-page app: `npm run build` produces a `dist/` folder that any static host can serve, as long as every path falls back to `index.html`. Both configurations below already include that.

### Vercel

1. Push the project to a GitHub, GitLab or Bitbucket repository.
2. In [vercel.com](https://vercel.com), click **Add New… → Project** and import the repository.
3. Vercel detects **Vite**. Leave the defaults: build command `npm run build`, output directory `dist`, install command `npm install`.
4. Under **Environment Variables**, add `VITE_SITE_URL` (your final address, e.g. `https://freshandgood.in`), plus `VITE_WHATSAPP_NUMBER`, `VITE_CONTACT_FORM_ENDPOINT` and `VITE_CONTACT_FORM_KEY` if you use them.
5. Click **Deploy**. `vercel.json` handles page routing and long-term caching of built assets.
6. To use your own domain, go to **Settings → Domains**, add it, and follow the DNS instructions. Then make sure `VITE_SITE_URL` matches it exactly and redeploy (**Deployments → ⋯ → Redeploy**), so canonical links and the sitemap use the right address.

Vercel uses Node 22 by default. If a build complains about the Node version, set **Settings → General → Node.js Version** to 22.x or newer.

### Netlify

1. Push the project to a Git repository.
2. In [app.netlify.com](https://app.netlify.com), click **Add new site → Import an existing project** and choose the repository.
3. `netlify.toml` already sets the build command (`npm run build`), publish directory (`dist`) and Node version (22), so you can accept the defaults.
4. Under **Site configuration → Environment variables**, add the same variables as above.
5. Click **Deploy site**. `public/_redirects` handles page routing.
6. Add a custom domain under **Domain management**, update `VITE_SITE_URL` to match, and trigger a new deploy.

### After the first deploy

- Open `https://<your-domain>/sitemap.xml` and `/robots.txt` and check that they show your domain.
- Submit the sitemap in [Google Search Console](https://search.google.com/search-console).
- Paste a page URL into the [Rich Results Test](https://search.google.com/test/rich-results) to check the product and organisation data.
- Share a link in WhatsApp to check the preview image.
- If you use the contact form, send yourself a test message.

## Future improvements

- **Admin panel with Supabase**: move categories, products, shops and stock into a Supabase database with a simple password-protected admin page, so the team can update stock and prices without editing code. Only `src/services/` would need to change, since every page already reads data through it.
- **Real product photography**: replace the placeholder SVGs with real photos in WebP or AVIF, served in several sizes with `srcset`.
- **Analytics**: add privacy-friendly analytics (for example Plausible or Umami) to see which products people search for and which shops they look up.
- **Live stock and opening status**: let shops mark items as in or out of stock, and show "Open now" badges based on each shop's hours.
- **Malayalam interface**: a full Malayalam version of the site, not just product names.
- **Pre-rendering**: generate static HTML for every page at build time, for even better search-engine and link-preview coverage.
