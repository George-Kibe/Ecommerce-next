# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

A two-app ecommerce project. Both apps are Next.js 16 App Router, plain
JavaScript (no TypeScript), sharing one MongoDB database.

| Path        | Port (convention) | Purpose |
| ----------- | ----------------- | ------- |
| `frontend/` | 3000 | Customer-facing storefront: browse, cart, Stripe checkout |
| `admin/`    | 3001 | Internal dashboard: product/category CRUD, S3 image upload, Google sign-in |

They are **separate npm projects**. There is no workspace root — run `npm install`
inside `frontend/` and `admin/` independently. A change to a model in one app
does *not* propagate to the other; the two `models/` directories are duplicated
copies and must be edited in both places when the schema changes.

## Commands

Run from inside `frontend/` or `admin/`:

```bash
npm install
npm run dev     # next dev
npm run build   # next build
npm start       # next start
npm run lint    # eslint (see note below)
```

There is no test suite. "Testing a change" means building the app and exercising
routes against a real MongoDB.

## Stack and version constraints

Next 16.3.5 · React 19.3 · Tailwind 4.3 · Mongoose 9.10 · Node >= 20.19.

Three version choices are **deliberate** — do not "upgrade" them without
addressing the underlying reason:

- **`eslint` is pinned to `^9`, not 10.** `eslint-config-next@16.3.5` advertises
  `eslint >=9` but crashes on ESLint 10 (`scopeManager.addGlobals is not a
  function`). Revisit when eslint-config-next supports ESLint 10.
- **`admin/` pins `mongodb` to `^6`, not 7.** `@auth/mongodb-adapter` peer-depends
  on `mongodb@^6`. Mongoose 9 bundles its own mongodb 7 driver internally; the two
  coexist because they open separate connections. `lib/mongodb.js` (raw driver,
  for the auth adapter) and `lib/db.js` (Mongoose, for app data) are intentionally
  distinct.
- **`next-auth` is on v4**, which is the latest *stable* line. See the security
  note below.

### Known security issue

`next-auth@4.24.15` pins `@auth/core@0.34.3`, which carries two critical
advisories (OAuth state/PKCE cookies not bound to the issuing provider; email
homoglyph normalization bypass). **There is no patched release in the v4 line.**
The fix is `next-auth@5.0.0-beta.x`, which depends on the patched
`@auth/core@0.41.3` but is still beta and needs the auth code rewritten
(`authOptions` → `NextAuth()` config export, `getServerSession()` → `auth()`).
`npm audit fix --force` suggests downgrading to 4.24.7 — do not do that; it is
not a real fix. Raise this tradeoff with the user rather than silently switching.

## Conventions that matter

### Next 16 route files

A `route.js` may only export HTTP handlers and route config. Shared auth helpers
live in `admin/lib/auth.js` (`authOptions`, `isAdminRequest`), **not** in
`app/api/auth/[...nextauth]/route.js`. Putting them back in the route file
breaks the build.

### `params` is a promise

Every dynamic segment receives `params` as a `Promise`:

```js
// server component / route handler
export const DELETE = async (request, { params }) => {
  const { id } = await params;
}

// client component ("use client")
import { use } from "react";
const { id } = use(params);
```

### Styling

Tailwind 4 with CSS-first config. `app/globals.css` does `@import "tailwindcss"`
and pulls the legacy JS config via `@config "../tailwind.config.js"`. The
`@layer base` block and `@utility ring` override in that file restore Tailwind 3
defaults (gray-200 borders, 3px blue ring) that the existing markup was written
against — removing them will visibly change many components.

PostCSS uses `@tailwindcss/postcss`. Autoprefixer is gone; Tailwind 4 handles
prefixing itself.

### styled-components (frontend only)

`frontend/` mixes Tailwind utilities with styled-components. SSR styles depend on
two things that must both stay in place:

1. `compiler.styledComponents: true` in `next.config.js`
2. `lib/StyledComponentsRegistry.jsx` wrapping children in `app/layout.jsx`

Without the registry the styled components render unstyled until hydration.

### Images

Use `images.remotePatterns` in `next.config.js`. `images.domains` was removed in
Next 16. New S3 buckets or avatar hosts must be added there or `next/image` will
reject them.

## Environment variables

`frontend/.env.local`:

```
MONGODB_URI=
STRIPE_SK=
PUBLIC_URL=http://localhost:3000
```

`admin/.env.local`:

```
MONGODB_URI=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=
NEXT_PUBLIC_AWS_S3_REGION=
NEXT_PUBLIC_S3_BUCKET_NAME=
```

Note the AWS credentials use the `NEXT_PUBLIC_` prefix, which **exposes the S3
secret key to the browser**. `admin/lib/uploadImageToS3.js` runs client-side and
uploads directly from the browser. Moving uploads to a route handler with
server-only credentials is the correct fix if this is touched.

## Admin access control

Admin identity is a hardcoded email allowlist in `admin/lib/auth.js`
(`adminEmails`). `isAdminRequest()` exists but its call site in
`app/api/products/route.js` is **commented out**, so the admin write APIs are
currently unauthenticated. Anyone who can reach the admin origin can create,
edit and delete products. Treat re-enabling it as a real change with real
consequences, and confirm before doing it.

## Pre-existing issues (not migration fallout)

These were present before the Next 16 upgrade. Fix only when asked:

- `frontend/app/page.jsx` hardcodes a featured product `_id`. If that document is
  missing, `Featured.jsx` dereferences null and the **build fails** at prerender.
- `admin/app/products/[id]/page.jsx` uses `pathname.split("/")[-1]`, which is
  always `undefined` in JavaScript. The page renders a placeholder.
- `admin/app/api/categories/route.js` POST passes a Mongoose document to
  `new NextResponse(...)`, returning an inspected object string rather than JSON.
- `frontend/app/categories/page.jsx` calls the async `getCategoryName()` without
  awaiting, rendering a Promise into JSX.
- `npm run lint` reports ~11 findings across both apps, mostly the React 19 rule
  `react-hooks/set-state-in-effect` plus unescaped quotes. None block the build.

## Verifying a change

`next build` alone will not catch much here — most breakage is runtime and
database-dependent. To check properly, point `MONGODB_URI` at a scratch database,
build, `next start`, and exercise the routes. The admin write APIs are the
fastest end-to-end check:

```bash
curl -X POST localhost:3001/api/products -H 'Content-Type: application/json' \
  -d '{"title":"t","description":"d","price":"1","images":[],"category":null,"properties":{}}'
curl localhost:3001/api/products
curl -X DELETE localhost:3001/api/products/<id>
```

The homepage needs a product whose `_id` matches the hardcoded featured ID, or
the build will fail before you get that far.
