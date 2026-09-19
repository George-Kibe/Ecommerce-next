# Ecommerce

A MongoDB-backed ecommerce project in two Next.js apps: a customer storefront and
an admin dashboard.

| App | Description |
| --- | --- |
| [`frontend/`](frontend/) | Storefront — product browsing, cart, Stripe checkout |
| [`admin/`](admin/) | Dashboard — product & category management, S3 image uploads, Google sign-in |

Both run on **Next.js 16.3.5** (App Router) with **React 19** and **Tailwind CSS 4**,
in plain JavaScript. They are independent npm projects sharing one MongoDB database.

## Requirements

- Node.js **20.19+** (22 LTS or newer recommended)
- A MongoDB database (Atlas or local)
- A Stripe account — storefront checkout **and webhooks**
- A Google OAuth client — admin sign-in
- An AWS S3 bucket — admin product images

## Getting started

Install each app separately; there is no workspace root.

```bash
cd frontend && npm install
cd ../admin && npm install
```

Copy the env templates and fill them in:

```bash
cp frontend/.env.example frontend/.env.local
cp admin/.env.example admin/.env.local
```

Then run each app in its own terminal:

```bash
cd frontend && npm run dev        # http://localhost:3000
cd admin && npm run dev -- -p 3001  # http://localhost:3001
```

Each `.env.example` documents every variable. Three are easy to miss:

- **`ADMIN_EMAILS`** (admin) — comma-separated allowlist of Google accounts
  permitted to sign in. The admin app **refuses to start** if this is empty,
  so a misconfigured deploy fails loudly rather than admitting everyone.
- **`STRIPE_WEBHOOK_SECRET`** (frontend) — without it, orders are never marked
  paid. See [Stripe webhook](#stripe-webhook).
- **`FEATURED_PRODUCT_ID`** (frontend) — optional. The homepage falls back to
  the newest product when unset.

### Stripe webhook

Payment confirmation arrives by webhook, not by the browser redirect. Until the
webhook is wired up, every order stays `paid: false`.

Locally:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

Copy the `whsec_…` it prints into `STRIPE_WEBHOOK_SECRET`.

In production, add an endpoint pointing at `https://your-domain/api/webhook`
subscribed to `checkout.session.completed` and
`checkout.session.async_payment_succeeded`, and use that endpoint's signing
secret.

### S3 bucket CORS

Uploads use presigned URLs, so the browser PUTs directly to S3. The bucket needs
CORS allowing `PUT` from the admin origin:

```json
[{
  "AllowedOrigins": ["https://your-admin-domain"],
  "AllowedMethods": ["PUT"],
  "AllowedHeaders": ["Content-Type"],
  "MaxAgeSeconds": 3000
}]
```

## Scripts

Available in both apps:

| Command | Description |
| --- | --- |
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint — `next lint` was removed in Next 16 |

Both apps build and lint with zero findings, and `npm audit` reports zero
vulnerabilities.

## Project layout

```
app/          App Router routes, layouts, API route handlers
components/   React components
context/      React context providers
lib/          Database clients, auth, guards, helpers
models/       Mongoose schemas
```

The `models/` directories are duplicated per app rather than shared — a schema
change must be applied in both.

## Tech stack

| | frontend | admin |
| --- | --- | --- |
| Framework | Next 16.3.5 · React 19.3 | Next 16.3.5 · React 19.3 |
| Styling | Tailwind 4.3, light/dark/system themes | Tailwind 4.3, light/dark/system themes |
| Database | Mongoose 9.10 | Mongoose 9.10 + mongodb 6 driver |
| Auth | — | Auth.js (NextAuth) v5 — Google |
| Payments | Stripe 22.6 + webhook | — |
| Storage | — | AWS SDK v3, presigned S3 uploads |

Two versions are pinned below "latest" deliberately:

- **ESLint 9**, not 10 — `eslint-config-next@16.3.5` crashes on ESLint 10.
- **mongodb 6**, not 7 — required by `@auth/mongodb-adapter`. Mongoose bundles
  its own mongodb 7 internally; the two coexist.

`next-auth` is on the **v5 beta**. This is required, not incidental: v4 depends
on a version of `@auth/core` with two unpatched critical advisories and no fixed
release in the v4 line.

## Security model

- **Order pricing is server-authoritative.** `/api/checkout` accepts only product
  ids and quantities; prices come from the database. Nothing the browser sends
  can change what a customer is charged.
- **Every admin page and API route is access-controlled.** API routes return
  `401` JSON via `withAdmin()`; pages verify the session via `requireAdmin()`.
  `admin/proxy.js` is a coarse first pass only — it checks that a session cookie
  exists, not who it belongs to.
- **AWS credentials never reach the browser.** Uploads use short-lived presigned
  PUT URLs issued by an admin-only endpoint, restricted to image types under 5MB
  with server-generated object keys.
- **Webhook events are signature-verified** and matched on both order id and
  Stripe session id, so a leaked order id cannot mark an order paid.
- **Security headers** (`X-Frame-Options`, `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS) are set on both apps;
  `X-Powered-By` is disabled and the admin sends `X-Robots-Tag: noindex`.

### ⚠️ The current AWS key is compromised — rotate it

Confirmed, not hypothetical. An earlier version used
`NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`, and the `NEXT_PUBLIC_` prefix bundles a
value into the client JavaScript served to every visitor. AWS's automated
scanning found the leaked key and attached the **`AWSCompromisedKeyQuarantineV2`**
policy to the IAM user (`George_mernbnb`), which now explicitly denies
`s3:ListBucket`, `s3:DeleteObject` and other actions.

`PutObject`/`GetObject` still work, so uploads succeed — but this is a known
leaked credential operating under an AWS quarantine.

To recover:

1. Create a new IAM user with a policy scoped to `s3:PutObject` and
   `s3:GetObject` on `arn:aws:s3:::<bucket>/products/*` only.
2. Set `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` — **never** with a
   `NEXT_PUBLIC_` prefix; that is exactly what leaked them.
3. Delete the old access key and remove the quarantine policy (or delete the
   old IAM user).
4. Review CloudTrail, the bucket contents and your AWS bill for activity you
   don't recognise.

The admin write APIs were unauthenticated in that same version, so review the
database for unexpected changes too.

## Branding and SEO

Brand identity lives in one file per app, `lib/brand.js`. The logo, favicon,
apple-icon, social card, web manifest, page titles and structured data all read
from it — renaming the store is a one-line change, with no icon files to redraw.
There are no static favicons; `next/og` generates them at build time.

The storefront ships:

- Per-page titles, descriptions and self-referencing canonicals
- Open Graph + Twitter cards, with a generated 1200x630 social image (product
  pages use the product photo instead)
- JSON-LD: Organization and WebSite site-wide, Product + Offer + BreadcrumbList
  on product pages, ItemList on the collection
- `sitemap.xml` with change frequency and priority, and a `robots.txt` that
  excludes the cart, account and API
- Web manifest and theme colour for installability

The admin is deliberately **excluded** from search — `Disallow: /`, `noindex,
nofollow, nocache` and an `X-Robots-Tag` header.

> **Set `PUBLIC_URL` at build time.** `robots.txt`, `sitemap.xml` and every
> canonical URL are statically generated and bake in the value present during
> `next build`. Setting it only as a runtime variable ships canonicals pointing
> at `localhost`.

## Known limitations

- **Currency is inconsistent.** Product cards and the cart show `Kshs.`, the
  product page shows `$`, and checkout charges **USD**. A product priced
  `120000` displays as "Kshs. 120,000" but bills USD 120,000. Pick the real
  currency and align the three UI labels, the `CURRENCY` constant in
  `app/api/checkout/route.js`, and `priceCurrency` in the product structured
  data. **Fix this before taking real payments.**
- `notFound()` returns HTTP 200 instead of 404 for routes nested two or more
  segments deep — Next 16.3.5 behaviour, reproducible with a bare `notFound()`
  page. The correct page renders and missing products are marked `noindex`, so
  the practical impact is limited to the status code.
- Product and category lists are unpaginated server-side; fine for hundreds of
  products, not thousands.
- No rate limiting on checkout. A burst creates unpaid order documents.
- An order row is written before Stripe confirms the session, so a Stripe outage
  can leave orphaned unpaid orders.

## License

Unlicensed / private.
