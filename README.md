# FK Web - Multi-Vendor E-Commerce Platform

A multi-vendor e-commerce platform built with Next.js 14, featuring separate seller storefronts, admin dashboard, and a Flipkart-style shopping experience.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (React 18), Tailwind CSS |
| Backend | Next.js API Routes (Node.js) |
| Database | SQLite via Prisma ORM |
| Language | JavaScript (ES6+) |

## Features

- **Multi-vendor storefronts** — each seller gets a unique URL at `/store/{username}`
- **Seller dashboard** — manage products, orders, and settings
- **Admin panel** — manage sellers, orders, and platform settings
- **Flipkart-style shopping pages** — product listing, cart, checkout, order history
- **UPI payment support**
- **JWT-based authentication**

## Project Structure

```
FK_Web-main/
├── frontend/               # Next.js app (main application)
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin panel pages & API routes
│   │   │   ├── api/        # All backend API routes
│   │   │   ├── seller/     # Seller dashboard pages
│   │   │   ├── store/      # Public storefront pages
│   │   │   ├── login/      # Seller login
│   │   │   └── register/   # Seller registration
│   │   ├── components/     # Reusable React components
│   │   └── lib/            # Utilities (auth, prisma, api)
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.js         # Database seeder
│   ├── public/             # Static HTML pages (storefront)
│   └── railway.json        # Railway deployment config
├── index.html              # Landing page
├── cart.html               # Cart page
├── checkout.html           # Checkout page
└── css/ js/ images/ shared/
```

## Local Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd frontend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### Run

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Default Credentials

After seeding, the database contains:
- **Seller:** `danish` / password set via seed
- **Seller:** `shreya` / password set via seed
- **Admin:** Create your first admin at `/admin/register`

## Deployment (Railway.app)

### 1. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USER/fk-web.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repo
3. Go to **Settings** → set **Root Directory** to `frontend`
4. Go to **Variables** → add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `file:/data/dev.db` |
| `JWT_SECRET` | *(generate a random 64-char string)* |

5. Go to **Volumes** → **Add Volume** → mount at `/data`
6. Once deployed, open **Shell** and run:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

## API Routes

All API routes are under `/api/` and are built into the Next.js app:

| Route | Description |
|---|---|
| `POST /api/auth/login` | Login |
| `POST /api/auth/register` | Register seller |
| `GET /api/public/products` | List active products |
| `GET /api/public/store/{username}` | Get store details |
| `GET /api/public/store/{username}/products` | Get store products |
| `POST /api/products` | Create product (seller) |
| `GET /api/admin/sellers` | List sellers (admin) |
| `GET /api/admin/orders` | List orders (admin) |

## License

MIT
