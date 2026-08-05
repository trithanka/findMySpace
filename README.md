# FindMySpace

Property listing site for Guwahati — PGs, rentals and homestays. Listings are
curated by the admin (we act as the middleman); visitors browse by locality and
enquire via WhatsApp or a callback form. No exact addresses are shown publicly,
only locality + landmark.

Owners can also list their own place at `/host` — a five-step flow that ends in
an admin review queue, so nothing reaches the public site unvetted.

## Stack

- **Next.js 16** (App Router, server actions) — one app for the public site and admin
- **PostgreSQL + Drizzle ORM** — schema in `src/db/schema.ts`
- **Better-Auth** — email/password + Google; admins are an allowlist (`ADMIN_EMAILS`), hosts are any signed-in user
- **Leaflet + OpenStreetMap** — host pins an exact location, public pages show an approximate circle. No API key, no billing account
- **Tailwind CSS v4**

## Getting started

```bash
npm install

# Local Postgres (Docker)
docker start findmyspace-postgres  # or create it:
# docker run -d --name findmyspace-postgres -e POSTGRES_USER=postgres \
#   -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=findmyspace \
#   -p 5436:5432 postgres:17-alpine

cp .env.example .env   # fill in values (see below)
npm run db:push        # apply schema
npm run db:seed        # localities + admin user + sample properties
npm run dev
```

Public site: http://localhost:3000 · Admin: http://localhost:3000/admin

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `BETTER_AUTH_SECRET` | `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | App URL (http://localhost:3000 in dev) |
| `ADMIN_EMAILS` | Comma-separated emails allowed into `/admin` |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Admin user created by `db:seed` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, sitemap) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp enquiry number, e.g. `9198…` (no `+`) |
| `CLOUDINARY_*` | Signed browser uploads for listing photos |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google sign-in for hosts (optional — the button hides without them) |

**The map needs no key.** Google Maps was deliberately not used: it requires a
billing account with a card on file even inside its free tier. Tiles come from
OpenStreetMap and address search from [Photon](https://photon.komoot.io) — both
keyless and free. The trade-off is weaker address matching in Guwahati than
Google would give, so the picker is built around dragging the pin, with search
as a shortcut and manual coordinates as a floor.

Two obligations that come with free tiles: the OpenStreetMap attribution must
stay visible on every map (it is set in `OSM_ATTRIBUTION`), and OSM's tile
policy is aimed at modest traffic. If listing volume grows, point `OSM_TILE_URL`
at a tile CDN (MapTiler, Stadia, Carto all have free tiers) — it is a one-line
change in `src/lib/map.ts`.

Google sign-in is separate and genuinely free; OAuth is not billed. Set it up at
APIs & Services → Credentials → *OAuth client ID* → Web application, with
redirect URI `{BETTER_AUTH_URL}/api/auth/callback/google`. Without it, hosts
sign in with email and nothing else changes.

## Scripts

- `npm run dev` / `build` / `start`
- `npm run check` — `tsc --noEmit` + ESLint
- `npm run db:push` / `db:generate` / `db:migrate` / `db:studio` / `db:seed`

## Structure

```
src/
  app/                 # routes only — thin, all logic lives below
    [category]/        # /pg-in-guwahati, /rent-in-guwahati, /homestays-in-guwahati (+ /[locality])
    guwahati/[locality]# all types in one locality
    property/[slug]    # detail page + enquiry
    admin/             # login + property CRUD + enquiries + submissions queue (admin guarded)
    host/              # owner onboarding: sign-in, my listings, 5-step wizard
    api/auth/[...all]  # Better-Auth handler
  components/
    ui/                # primitives (badge, form fields)
    layout/            # site header/footer
    property/          # card, grid, filters, enquiry form
    admin/             # property form, table actions, submission review
    host/              # location picker, wizard steps, photo upload
  server/
    queries/           # all reads (public + admin), server-only
    actions/           # all mutations (server actions, admin-guarded)
    auth-guard.ts      # getAdminSession / requireAdmin / getUserSession / requireUser
  db/                  # drizzle schema, client, seed
  lib/                 # auth, constants, utils, map + geocoding (`map.ts`)
  config/site.ts       # site name, city, contact
```

Conventions:

- Pages never touch `db` directly — always go through `src/server/queries` or
  `src/server/actions`. Every mutation calls `requireAdmin()` first.
- Property display codes (`FMS-1024`) are derived from the row id
  (`propertyCode()` in `src/lib/utils.ts`), not stored.
- Owner name/phone are private columns — never render them on public pages. So
  are `latitude`/`longitude`/`address_line`: the exact pin is blurred by
  `approximateLocation()` **on the server**, and only the blurred point is sent
  to the browser. That function lives in `src/server/approximate-location.ts`
  and is `server-only` on purpose: its seed is the property id, which is public
  via the `FMS-1024` code, so shipping the algorithm to the client would make
  the blur trivially reversible.
- Two independent status axes on `properties`. `status` is the admin's
  publication state (available/occupied/hidden); `submission_status` is the host
  pipeline (draft → submitted → approved/rejected). Public queries require
  **both** `status = 'available'` and `submission_status = 'approved'` — an
  allowlist, so a new pipeline state can never accidentally publish rows.
  Admin-created listings default to `approved` and are unaffected.
- Host actions take the listing id from the URL, so every one of them loads the
  row through `getHostListing(id, userId)` — ownership is enforced per row, never
  assumed from the session alone.
- Instagram reels are stored as a bare **shortcode** (`instagram_shortcode`), never
  a pasted URL — `src/lib/instagram.ts` extracts it from whatever the admin pastes
  and builds the embed `src`, so no raw input reaches the iframe. The detail page
  plays it in an in-page modal (`components/property/reel-modal.tsx`).
- New localities/property types: `src/db/seed.ts` and `src/lib/constants.ts`.

## Host flow

`/host` is the single entry point — the "List your property" links in the header
and footer land there. Signed out it shows the sign-in / create-account card
(Google plus email+password, no phone number); signed in it redirects straight
to `/host/listings`. The old `/host/login` URL forwards to `/host`.

From there, `/host/listings/new`:

1. **Place** — type, locality, exact pin on the map: search an address, click
   the map, drag the marker, use the browser's location, or type coordinates
   (creates the draft row)
2. **Details** — title, description, rooms, furnishing, amenities
3. **Photos** — straight from the browser to Cloudinary
4. **Price** — rent, deposit, private contact number
5. **Review** — submit, which moves it to `submitted`

The admin sees it at `/admin/submissions` with the precise pin and a Maps link,
then approves (publishes) or sends it back with a note the host sees on their
listing. Editing a live listing and resubmitting drops it back into review.

## Legal pages

`/privacy` and `/terms` are linked from the footer, listed in the sitemap, and
referenced by consent lines on the enquiry form and the host sign-in card
(collecting consent at the point of collection is what the DPDP Act asks for).

**Both are drafts and need a lawyer's review before launch.** The business
details they quote — legal entity name, address, contact email, grievance
officer, jurisdiction — live in `legalConfig` in `src/config/site.ts` and are
currently placeholders. Bump `legalConfig.lastUpdated` whenever either document
changes materially.

Write these pages with **literal typographic characters** (’ “ ” —), not HTML
entities. A JSX text node that contains an entity has its leading whitespace
trimmed by the compiler, which silently eats the space in constructs like
`<strong>Meta</strong> — text`.

## Deploying

- App → Vercel (set all env vars; `BETTER_AUTH_URL` + `NEXT_PUBLIC_SITE_URL` to the real domain)
- DB → Supabase/Neon free tier, then `npm run db:push` + `db:seed` against it
- Images are plain URLs for now (`property_images.url`) — upload to any bucket
  and paste URLs in the admin form; allowed hosts in `next.config.ts`
