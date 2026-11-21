# tyrespeed Harare

Website and workshop tools for a Harare tyre and wheel workshop. The public pages use local photography and typed content; the tyre finder, quote drawer, slot picker, booking wizard and command palette are unchanged in behaviour.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Node 20.9 or newer is required.

```bash
npm run build       # production build (output: .next-build/ locally, .next/ on Vercel)
npm run start       # serve the production build
npm run lint        # ESLint
npm run typecheck   # TypeScript, no emit
npm run test:e2e    # Playwright smoke and accessibility checks
npm run test:e2e:ui # Playwright in UI mode
```

The Playwright config uses the locally installed Chrome when present and falls back to bundled Chromium in CI. Run `npx playwright install chromium` once on a new machine.

## Workshop details

- Address: **20 McChlery Road, Eastlea, Harare** (linked to Google Maps directions)
- Phone: **0773 646 6184** (`tel:+2637736466184`)
- WhatsApp: **0773 646 6184** (`https://wa.me/2637736466184`)
- Email: `hello@tyrespeed.co.zw` (configured, not independently verified)
- Public base URL: `NEXT_PUBLIC_SITE_URL` (defaults to `https://tyrespeed.co.zw`, not independently verified)

Opening hours are in `lib/site.ts`. `site.closures` is intentionally empty. Add a `{ date, reason }` entry there for a real closure rather than inventing one.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, categories, indicative inventory, services, workshop, brands, live slots, FAQ and visit band |
| `/tyres` | Inventory with size, vehicle, type and brand filters, grid/list views and a fitment checker |
| `/services` and `/services/[slug]` | Filterable service table and per-service records |
| `/workshop` | Workshop details, directions, arrival steps and optional evidence |
| `/book` | Four-step booking: service, vehicle, slot, contact |
| `/faq` | Searchable FAQ |
| `/privacy`, `/terms`, `/refunds`, `/tyre-disposal` | Editorial policy documents |
| `/admin` | Token-protected submission review (not linked in public navigation, `noindex`) |
| `/contact` | Redirects to `/book` |
| `/api/slots?days=14` | Deterministic slots, excluding saved bookings |
| `/api/bookings` | `POST` booking intake with validation and rate limit |
| `/api/enquiries` | `POST` quote intake with validation and rate limit |
| `/api/admin/submissions` | `GET` protected submission list |
| `/api/events` | `POST` privacy-friendly events, disabled by default |
| `/api/health` | `GET` health check |

Prices in the catalogue and service list are **indicative**. The workshop confirms stock, fitment and the final total before work starts. `lib/proof.ts` contains intentionally empty reviews, certifications and workshop-evidence arrays; add only supplied, verifiable material.

## Structure

```text
app/                      App Router pages, handlers, metadata, sitemap, robots
components/layout/        Utility bar, header, footer, analytics clicks, mobile action bar
components/providers/     Quote state, drawer, palette and toast provider
components/utilities/     Command palette, quote drawer, quote button, focus trap, toasts
components/admin/         Token-protected submissions table
components/home/          Hero, categories, featured tyres, availability strip
components/tyres/         Inventory browser, fitment checker
components/services/      Service table, add-to-quote button
components/booking/       Booking wizard
components/faq/           Searchable FAQ
components/schematics/    Inline SVG tyre and alignment diagrams
lib/                      Site config, proofs, analytics, bookings, slots, persistence, notify, rate limit
data/                     Created on first write: *.jsonl (gitignored)
public/images/            Locally stored photography
e2e/                      Playwright smoke and axe accessibility checks
.github/workflows/ci.yml  Typecheck, lint, build and end-to-end CI
```

## Environment

Copy `.env.example` to `.env.local` and fill in only what applies.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, OG/Twitter metadata and sitemap |
| `ADMIN_TOKEN` | Required for `/api/admin/submissions`. Without it the route returns 404; a wrong token returns 401 |
| `NOTIFY_WEBHOOK_URL` | Optional non-sensitive submission summary webhook |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | `true` enables `/api/events` and first-party events. Default `false` |
| `BOOKING_DATA_FILE`, `QUOTE_DATA_FILE`, `EVENT_DATA_FILE` | Optional JSONL paths, default `./data/*.jsonl` |

Submissions are appended as newline-delimited JSON (`data/bookings.jsonl`, `data/quotes.jsonl`, `data/events.jsonl`). Reads still accept a legacy `.json` array at the same path. Rate limits are five intake requests, thirty admin requests and sixty event requests per client per ten minutes.

The UI never claims a webhook notification happened unless the webhook returned successfully: it says the request is saved and offers a WhatsApp confirmation link. Events store only an event name, path, timestamp and random per-session id in `sessionStorage`, with no cookies and no personal fields.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

The Playwright suite covers the home page, tyre filters/deep links/grid-list, booking submission, quote submission, command palette, mobile menu, legal routes, axe WCAG A/AA and best-practice rules at 1440px and 390px, 2px focus rings and reduced motion. CI runs the same commands.

## Design system

- Neutral canvas `#FAFAFA`, white surfaces, ink `#0B0B0C`, muted `#6B6F76`, neutral border `#E5E5E5` and one signal accent `#FF4A1C`. No beige palette or blue/purple.
- Self-hosted Barlow and Barlow Condensed from `public/fonts`; no external font requests and no italic serif.
- Depth comes from tonal surfaces, spacing and radii. No box-shadow, gradients, backdrop-filter, glass or glow.
- Sentence-case headings. No eyebrows, marquees, icon tiles, numbered feature tiles, fake testimonials, fake stats, fake staff, em/en/middle dashes or invented certifications.
- `prefers-reduced-motion` removes smooth scrolling and all transitions/animations and reveals all opted-in content. Focus rings are 2px solid, and native scrollbars stay hidden where the original design hides them.

## Image attribution

Photography in `public/images/` was sourced from Pexels and stored locally; no external image service is called at runtime. Pexels photos are free to use, and source IDs are recorded for traceability. Photographer names were not retained with the downloads.

| Local file | Pexels image ID | Used for |
| --- | --- | --- |
| `hero-tyre-stack.jpg` | 34357281 | Home hero, OG/Twitter image |
| `workshop-fitting.jpg` | 3806249 | Services feature |
| `passenger-tyres.jpg` | 8886305 | Passenger category |
| `suv-tyres.jpg` | 19826713 | SUV & 4x4 category |
| `performance-tyres.jpg` | 10182903 | Performance category |
| `commercial-tyres.jpg` | 7019610 | Commercial category |
| `alignment-bay.jpg` | 3806288 | Booking and alignment pages |
| `workshop-technician.jpg` | 3807799 | Workshop process |
| `alloy-wheel.jpg` | 10123980 | Wheel detail imagery |
| `tyre-depot.jpg` | 3806252 | Visit band |

Alt text describes image content; no photo is presented as a tyrespeed employee or a real customer.

## Before launch

Confirm `hello@tyrespeed.co.zw` and `NEXT_PUBLIC_SITE_URL`, supply any real closure dates, reviews, certifications or workshop evidence, and replace the sample inventory, services and job records with the workshop's actual data. Nothing in those categories is presented as verified until it is supplied.
