# MarketHub — Next.js Multi-Vendor Shopping Cart

A full-stack starter for a three-role marketplace:

- Customer dashboard
- Seller dashboard
- Admin dashboard
- Seller product submission
- Admin approval/rejection workflow
- Approved-only customer storefront
- Cart and inventory validation
- Prisma database
- NextAuth credentials authentication
- Responsive UI

## Stack

Next.js App Router + TypeScript + Prisma + MongoDB Atlas + Cloudinary + NextAuth + Zod.

## Requirements

Node.js 20+ recommended.

## Setup

```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

## Demo accounts

All seeded accounts use:

`Demo@12345`

Admin:
`admin@example.com`

Seller:
`seller@example.com`

Customer:
`customer@example.com`

These are development credentials only.

## Approval workflow

1. Seller creates a product.
2. Server creates it with `PENDING_APPROVAL`.
3. The product is excluded from the public product query.
4. Admin opens Product Approvals.
5. Admin approves or rejects it.
6. Only `APPROVED` products are shown to customers.
7. Rejected products store a rejection reason.

Authorization is enforced on the server, not just by hiding UI.

## Production next steps

- Configure MongoDB Atlas and Cloudinary using `.env`.
- Add email/notification delivery.
- Add full order/checkout server actions.
- Add pagination, advanced search, analytics charts, coupons and moderation screens.
- Add CSRF/rate limiting and production security headers.
- Add automated unit/integration/e2e tests.
