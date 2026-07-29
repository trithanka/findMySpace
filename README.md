# FindMySpace

Property listing site for Guwahati — PGs, rentals and homestays. Listings are
curated by the admin (we act as the middleman); visitors browse by locality and
enquire via WhatsApp or a callback form. No exact addresses are shown publicly,
only locality + landmark.

## Stack

- **Next.js 16** (App Router, server actions) — one app for the public site and admin
- **PostgreSQL + Drizzle ORM** — schema in `src/db/schema.ts`
- **Better-Auth** — email/password, admin-only (allowlist via `ADMIN_EMAILS`)
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
    admin/             # login + property CRUD + enquiries (Better-Auth guarded)
    api/auth/[...all]  # Better-Auth handler
  components/
    ui/                # primitives (badge, form fields)
    layout/            # site header/footer
    property/          # card, grid, filters, enquiry form
    admin/             # property form, table actions
  server/
    queries/           # all reads (public + admin), server-only
    actions/           # all mutations (server actions, admin-guarded)
    auth-guard.ts      # getAdminSession / requireAdmin
  db/                  # drizzle schema, client, seed
  lib/                 # auth, constants, utils
  config/site.ts       # site name, city, contact
```

Conventions:

- Pages never touch `db` directly — always go through `src/server/queries` or
  `src/server/actions`. Every mutation calls `requireAdmin()` first.
- Property display codes (`FMS-1024`) are derived from the row id
  (`propertyCode()` in `src/lib/utils.ts`), not stored.
- Owner name/phone are private columns — never render them on public pages.
- New localities/property types: `src/db/seed.ts` and `src/lib/constants.ts`.

## Deploying

- App → Vercel (set all env vars; `BETTER_AUTH_URL` + `NEXT_PUBLIC_SITE_URL` to the real domain)
- DB → Supabase/Neon free tier, then `npm run db:push` + `db:seed` against it
- Images are plain URLs for now (`property_images.url`) — upload to any bucket
  and paste URLs in the admin form; allowed hosts in `next.config.ts`
