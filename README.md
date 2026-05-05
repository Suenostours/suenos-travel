# Morocco Incoming by Suenos Travel

Full-stack DMC (Destination Management Company) website for Suenos Travel Morocco - a licensed incoming travel agency (ODV-0564 / IATA 54273844).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui |
| Backend | Hono + tRPC 11.x |
| ORM | Drizzle ORM |
| Database | MySQL |
| Auth | Custom JWT + bcrypt |
| Upload | Local file storage (`/public/uploads/`) |
| SEO | react-helmet-async + sitemap.xml + robots.txt |

## Prerequisites

- Node.js 20+
- MySQL 8.0+
- Git

## Installation (Local)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd app
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

### 3. Database Setup

Create a MySQL database and set `DATABASE_URL` in `.env`:

```
mysql://user:password@localhost:3306/morocco_incoming
```

Then push the schema:

```bash
npm run db:push
```

### 4. Seed Data

```bash
npx tsx db/seed.ts
```

This creates the default admin account:
- **Email**: `admin@morocco-incoming.com`
- **Password**: `Admin@12345`

### 5. Start Development Server

```bash
npm run dev
```

The app runs at `http://localhost:3000`

### 6. Production Build

```bash
npm run build
npm start
```

## Project Structure

```
app/
├── src/
│   ├── components/        # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── providers/        # Context providers (i18n, tRPC)
│   ├── hooks/            # Custom hooks
│   └── App.tsx           # Route definitions
├── api/                  # Backend tRPC routers & Hono server
│   ├── admin-auth.ts     # Admin JWT auth utilities
│   ├── admin-auth-router.ts
│   ├── settings-router.ts
│   ├── public-router.ts
│   ├── tours-router.ts
│   ├── cities-router.ts
│   ├── blog-router.ts
│   ├── seo-router.ts
│   ├── upload-handler.ts
│   └── router.ts
├── db/
│   ├── schema.ts         # Drizzle schema definitions
│   ├── seed.ts           # Seed script
│   └── relations.ts
├── contracts/            # Shared types/constants
├── public/uploads/       # Uploaded images storage
└── dist/                 # Production build output
```

## Database Schema

### Tables
- `admins` - Admin users with roles (super_admin, admin, editor)
- `users` - Framework internal (OAuth)
- `site_settings` - Site configuration (contact info, SEO, pixels)
- `cities` / `city_translations` - Destinations with FR/EN content
- `tours` / `tour_translations` / `tour_cities` - Circuits with FR/EN content
- `excursions` / `excursion_translations` - Day trips with FR/EN content
- `blog_posts` / `blog_translations` - Blog articles with FR/EN content
- `media` - Uploaded file records
- `contact_requests` - Contact form submissions
- `quote_requests` - Quote form submissions
- `partner_requests` - B2B partner submissions
- `seo_settings` - Per-page SEO metadata

### Multilingual Architecture
Tables are separated with `_translations` suffix (e.g., `tour_translations`).
**Why**: Better query performance, cleaner admin interface, easy to extend to more languages.

## Admin Dashboard

Navigate to `/admin/login` and sign in with the seeded credentials.

### Admin Features
- Dashboard overview (stats)
- Tours / Circuits CRUD
- Cities / Destinations CRUD
- Excursions CRUD
- Blog Posts CRUD (draft/published)
- Media Gallery (upload from laptop)
- Site Settings (all contact info, hero text, pixels)
- SEO Management (per-page meta)
- Contact/Quote Requests (status management)
- Admin Management (roles, password change)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `APP_ID` | Kimi OAuth app ID | Yes (framework) |
| `APP_SECRET` | Kimi OAuth app secret | Yes (framework) |
| `JWT_SECRET` | Secret for admin JWT tokens | Yes |
| `KIMI_AUTH_URL` | Kimi auth endpoint | Yes (framework) |
| `KIMI_OPEN_URL` | Kimi API endpoint | Yes (framework) |
| `OWNER_UNION_ID` | Owner union ID | No |
| `PORT` | Server port (default 3000) | No |

## Railway Deployment

### 1. Create Services
- **Web Service**: Connect your GitHub repo, auto-deploy from main branch
- **MySQL**: Add a MySQL database service

### 2. Environment Variables on Railway

Add these in Railway Dashboard > Variables:

```
DATABASE_URL=${{MySQL.DATABASE_URL}}
APP_ID=your-app-id
APP_SECRET=your-app-secret
JWT_SECRET=your-secure-jwt-secret-min-32-chars
KIMI_AUTH_URL=https://agents.cn/oauth
KIMI_OPEN_URL=https://agents.cn
PORT=3000
```

### 3. Build & Start Commands

In Railway service settings:
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### 4. Persistent Storage for Uploads

On Railway, add a volume mount:
- **Mount Path**: `/app/public/uploads`
- This ensures uploaded images persist across deployments

### 5. Custom Domain

- Add your domain (`www.morocco-incoming.com`) in Railway dashboard
- Configure DNS: CNAME `www` -> your Railway domain
- For root domain: Use a redirect service or DNS provider that supports ALIAS/ANAME

### 6. WWW Redirect

Add this middleware in `api/boot.ts` or configure at DNS level:
- `morocco-incoming.com` → `301` → `www.morocco-incoming.com`

## Security Checklist

- [x] Passwords hashed with bcrypt (cost 12)
- [x] JWT with secret in environment variable
- [x] HttpOnly, Secure, SameSite=Lax cookies
- [x] Route protection via tRPC middleware
- [x] Zod validation on all inputs
- [x] No secrets exposed in frontend code
- [x] Upload file validation (type, size)
- [ ] Rate limiting on login (recommend: add `express-rate-limit` or Hono equivalent)
- [ ] CSP headers (recommend: add in Hono middleware)

## Backup

### Database Backup
```bash
# MySQL dump
mysqldump -u user -p morocco_incoming > backup_$(date +%Y%m%d).sql
```

### Images Backup
```bash
# Uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz public/uploads/
```

## License

© Suenos Travel. All rights reserved.
