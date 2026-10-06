# Fresh & Good

A storefront for Kerala groceries in Kochi. Browse fresh produce, spices, snacks, seafood and breakfast staples, and find the nearest partner shop that stocks them.

> **Status:** Phases 1 (foundation and layout) and 2 (catalogue) are complete. Find a Shop, Search, About and Contact are placeholders until their phase is built.

## Tech stack

- **React 19** + **TypeScript** on **Vite**
- **Tailwind CSS v4** (via `@tailwindcss/vite`), with brand tokens in `src/index.css`
- **React Router** for client-side routing, with lazy-loaded pages
- **react-helmet-async** for per-page titles and meta tags
- **lucide-react** for icons; **clsx** + **tailwind-merge** for class names
- **Leaflet** / **react-leaflet** for maps (installed now, used in Phase 3)
- **ESLint** (flat config) + **Prettier** (with the Tailwind class-sorting plugin)

## Getting started

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env.local   # then edit the values
npm run dev                  # http://localhost:5173
```

### Environment variables

| Variable               | Purpose                                                                                            |
| ---------------------- | -------------------------------------------------------------------------------------------------- |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number for the floating chat button, digits only, with country code (e.g. `919800000000`) |
| `VITE_SITE_URL`        | Public site URL, used for canonical links and the sitemap                                          |

Both have safe defaults, so the app runs without a `.env.local`. The default WhatsApp number is a placeholder: set a real one before deploying.

## Scripts

| Command                | What it does                       |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Start the dev server               |
| `npm run build`        | Type-check and build to `dist/`    |
| `npm run preview`      | Serve the production build locally |
| `npm run lint`         | Run ESLint                         |
| `npm run lint:fix`     | Run ESLint and auto-fix            |
| `npm run format`       | Format everything with Prettier    |
| `npm run format:check` | Check formatting without writing   |
| `npm run typecheck`    | Type-check only                    |

## Project structure

```
src/
├── App.tsx              # Providers + route table (lazy-loaded pages)
├── main.tsx             # Entry point
├── index.css            # Tailwind import + brand theme tokens
├── components/
│   ├── category/        # CategoryCard, CategoryGrid
│   ├── common/          # PageLoader, PhasePlaceholder, LegacyRedirect
│   ├── home/            # HomeHero, WhyChooseUs, ShopTeaser, Testimonials
│   ├── layout/          # Header, Footer, Layout, Logo, ScrollToTop, WhatsAppButton
│   ├── product/         # ProductCard/Grid, ProductBrowser, ProductFilters, ProductSort,
│   │                    # ActiveFilterChips, ProductGallery, ProductShopAvailability
│   ├── seo/             # PageMeta (Helmet wrapper)
│   └── ui/              # Button, Card, Badge, DietBadge, Input, Skeleton, EmptyState,
│                        # Breadcrumbs, Container, SectionHeading, ErrorBoundary, ErrorState,
│                        # SmartImage, Drawer, Checkbox, Select
├── config/site.ts       # Site name, contact details, nav links, WhatsApp link builder
├── data/                # Seed data: categories, products, shops (services only!)
├── hooks/               # useAsync, useDebounce, useQueryParams, useProductFilters
├── pages/               # One file per route
├── services/            # categoryService, productService, shopService
├── types/               # Shared domain types
└── utils/               # cn, formatPrice, distance, opening hours, pluralize, slugify,
                         # product filter/sort helpers, route path builders
```

### Conventions

- **Imports** use the `@/` alias for `src/` (e.g. `import { cn } from '@/utils'`).
- **Data access goes through `src/services/`.** Components and pages never import from `src/data/`, and ESLint enforces this with `no-restricted-imports`. Service functions are async and add a small simulated delay, so swapping in a real API later won't change any callers.
- **Seed data integrity** (unique IDs and slugs, valid category and shop references) is checked in development, and any problems are logged to the browser console.
- **Filters live in the URL.** `useProductFilters` reads `diet`, `minPrice`, `maxPrice`, `tags`, `categories` and `sort` from the query string (lists are comma-separated), so refreshes and shared links keep the filters.
- **Images** live in `public/images/` (placeholder SVGs for now; swap paths in the seed data for real photos). `SmartImage` reserves a fixed aspect ratio, lazy-loads, and falls back to `/images/fallback.svg` on error.
- **`useAsync`** expects a memoised function: `useAsync(useCallback(() => productService.getBySlug(slug), [slug]))`.

## Routes

| Path              | Page           | Phase |
| ----------------- | -------------- | ----- |
| `/`               | Home           | 2 ✅  |
| `/categories`     | All categories | 2 ✅  |
| `/category/:slug` | Category       | 2 ✅  |
| `/products`       | All products   | 2 ✅  |
| `/product/:slug`  | Product detail | 2 ✅  |
| `/shops`          | Find a Shop    | 3     |
| `/search?q=`      | Search results | 4     |
| `/about`          | About          | 4     |
| `/contact`        | Contact        | 4     |
| `*`               | 404 Not Found  | 1 ✅  |

## Build phases

1. ✅ **Foundation and layout**: setup, types, seed data, utils, services, UI primitives, layout, routing, placeholder pages
2. **Catalogue**: Home, Categories, Category page, Products, Product detail
3. **Shops**: Find a Shop, geolocation, maps, shop availability on product pages
4. **Polish**: Search, About, Contact, SEO (sitemap, robots, meta), final README, deployment polish

## Deployment

The app is a static SPA, so every route must fall back to `index.html`:

- **Vercel:** `vercel.json` rewrites all paths to `/index.html` and caches hashed assets for a year.
- **Netlify:** `public/_redirects` holds the equivalent rule (`/* /index.html 200`).

Build command: `npm run build`. Output directory: `dist`.
