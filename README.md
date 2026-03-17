#  MedAI Pro — Smart Medicine Reference Platform

A web application for searching medicines, pharmaceuticals, and medical news, built with **Next.js 16** and **Supabase**.

##  Features

-  **Medicine Search** — Search by name, specialty category
-  **Medical News** — Stay updated with the latest medical information
-  **User Authentication** — Sign up / Sign in (Supabase Auth)
-  **Admin Portal** — Manage medicines, categories, and news
-  **AI Assistant** — Medicine suggestions based on symptoms

##  Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deploy | Netlify / Vercel |

##  Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/nguyenhainam2502/Medicine-Web.git
cd Medicine-Web
npm install
```

### 2. Configure Environment

Create the file `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

>  Get these keys from **Supabase Dashboard → Settings → API**

### 3. Initialize Database

Run the SQL files in the `supabase/` directory in order:

```
1. migrations/20260304071402_init_core_tables.sql
2. admin_setup.sql
3. add_image_url.sql
4. add_news_table.sql
```

### 4. Start Dev Server

```bash
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
Medicine-Web/
├── apps/
│   └── web/                  # Next.js app
│       └── src/
│           ├── app/
│           │   ├── admin/    # Admin portal
│           │   ├── news/     # Medical news
│           │   ├── products/ # Medicine listings
│           │   └── profile/  # User profile
│           ├── components/   # React components
│           └── lib/          # Supabase client
└── supabase/                 # Database migrations & SQL
```

##  Environment Variables

| Variable | Description | Public? |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |  Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (read-only) |  Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key |  **Secret** |

##  License

MIT © 2026 MedAI Pro
