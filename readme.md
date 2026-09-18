# Ecommerce

A MongoDB-backed ecommerce project in two Next.js apps: a customer storefront and
an admin dashboard.

| App | Description |
| --- | --- |
| [`frontend/`](frontend/) | Storefront — product browsing, cart, Stripe checkout |
| [`admin/`](admin/) | Dashboard — product & category management, S3 image uploads, Google sign-in |

Both run on **Next.js 16.3.5** (App Router) with **React 19** and **Tailwind CSS 4**,
in plain JavaScript. They are independent npm projects that share one MongoDB
database.

## Requirements

- Node.js **20.19+** (22 LTS or newer recommended)
- A MongoDB database (Atlas or local)
- A Stripe account — storefront checkout
- A Google OAuth client — admin sign-in
- An AWS S3 bucket — admin product images

## Getting started

Install each app separately; there is no workspace root.

```bash
cd frontend && npm install
cd ../admin && npm install
```

Create the env files described below, then run each app in its own terminal:

```bash
cd frontend && npm run dev   # http://localhost:3000
cd admin && npm run dev -- -p 3001   # http://localhost:3001
```

### Environment

`frontend/.env.local`

```
MONGODB_URI=mongodb+srv://...
STRIPE_SK=sk_test_...
PUBLIC_URL=http://localhost:3000
```

`admin/.env.local`

```
MONGODB_URI=mongodb+srv://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=...            # openssl rand -base64 32
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=...
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=...
NEXT_PUBLIC_AWS_S3_REGION=eu-west-1
NEXT_PUBLIC_S3_BUCKET_NAME=your-bucket
```

The storefront homepage renders a featured product looked up by a **hardcoded
`_id`** in [frontend/app/page.jsx](frontend/app/page.jsx). If your database has no
document with that id, the production build fails while prerendering `/`. Point it
at a real product in your data before running `npm run build`.

## Scripts

Available in both apps:

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint — `next lint` was removed in Next 16, this calls `eslint` directly |

## Project layout

Both apps follow the same shape:

```
app/          App Router routes, layouts, API route handlers
components/   React components
context/      React context providers
lib/          Database clients and helpers
models/       Mongoose schemas
```

The `models/` directories are duplicated in each app rather than shared — a schema
change has to be applied in both.

## Tech stack

| | frontend | admin |
| --- | --- | --- |
| Framework | Next 16.3.5 · React 19.3 | Next 16.3.5 · React 19.3 |
| Styling | Tailwind 4.3 + styled-components 6.5 | Tailwind 4.3 |
| Database | Mongoose 9.10 | Mongoose 9.10 + mongodb 6 driver |
| Auth | — | NextAuth 4.24 (Google) |
| Payments | Stripe 22.6 | — |
| Storage | — | AWS SDK v3 (S3) |
| Other | axios, react-toastify | axios, react-toastify, react-sortablejs, react-spinners, moment |

Two versions are pinned below "latest" on purpose:

- **ESLint 9**, not 10 — `eslint-config-next@16.3.5` crashes on ESLint 10.
- **mongodb 6**, not 7 — required by `@auth/mongodb-adapter`. Mongoose bundles its
  own mongodb 7 internally; the two coexist.

## Security notes

Three things to be aware of before deploying this:

1. **NextAuth v4 carries unpatched critical advisories.** `next-auth@4.24.15`
   depends on `@auth/core@0.34.3`, affected by GHSA-x445-f3h2-j279 (OAuth state,
   nonce and PKCE cookies are not bound to the provider that issued them) and
   GHSA-7rqj-j65f-68wh (email homoglyph normalization bypass). The v4 line has no
   fixed release; the patched dependency ships with `next-auth@5.0.0-beta`, which
   requires migrating the auth configuration.
2. **The admin write APIs are unauthenticated.** `isAdminRequest()` is defined in
   [admin/lib/auth.js](admin/lib/auth.js) but its call is commented out in
   [admin/app/api/products/route.js](admin/app/api/products/route.js). Product
   create/edit/delete is open to anyone who can reach the admin origin.
3. **S3 credentials are exposed to the browser.** The admin uploader uses
   `NEXT_PUBLIC_`-prefixed AWS keys and uploads client-side, so the secret access
   key is bundled into client JavaScript. Use a scoped, rotatable key at minimum,
   or move uploads behind a server route.

## License

Unlicensed / private.
