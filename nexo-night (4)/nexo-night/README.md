# NEXO NIGHT — 21+ Adult Game

A production-ready browser game built with React + Vite + Supabase.

## What Goes Where

| Component | Destination |
|-----------|-------------|
| Frontend (dist/) | Netlify / Cloudflare Pages |
| Database & Auth | Supabase |
| Images | Supabase Storage |

## Required Environment Variables

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**NEVER** add `SUPABASE_SERVICE_ROLE_KEY` to frontend.

## Setup Steps

### Step 1: Create Supabase Project
- Go to https://supabase.com
- Create new project
- Copy Project URL and Anon Key from Settings → API

### Step 2: Run Database Migrations
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/001_initial_schema.sql`
3. Run the SQL

### Step 3: Seed Data
1. In SQL Editor, run `supabase/seed.sql`

### Step 4: Create Storage Bucket
1. Go to Storage → New Bucket
2. Name: `game-assets`
3. Set to Public
4. Create folders: `modules/`, `cards/`, `avatars/`, `rewards/`, `backgrounds/`

### Step 5: Create First Admin
1. Register through the app (visit `/register`)
2. In SQL Editor run:
   ```sql
   INSERT INTO admin_users (user_id)
   SELECT id FROM auth.users WHERE email = 'your-email@example.com';
   ```
3. Refresh the app — Admin Panel will appear in menu

### Step 6: Local Development
```bash
npm install
npm run dev
```

### Step 7: Production Build
```bash
npm run build
```
Upload `dist/` folder to Netlify or Cloudflare Pages via Drag & Drop.

## Security Features

- **RLS policies** prevent players from modifying coins, XP, level directly
- **Game results** processed via server-side function `process_game_result()`
- **Admin panel** hidden and protected by `admin_users` table
- **No Service Role Key** in frontend — only Anon Key
- Players cannot send fake rewards — server calculates everything

## Game Features

- Truth / Dare / Flirt / Challenge / Strip / Choice cards
- 4 levels: Flirt → Hot → Dare → Finale
- Character selection (21+ only)
- Clothing system (strip on loss)
- Daily rewards & missions
- Ranking system with tiers (Bronze → Legend)
- VIP Shop with gems & coins
- Admin content management (modules, cards, images)
- Real-time multiplayer-ready architecture

## Project Structure

```
nexo-night/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route pages
│   ├── admin/           # Admin panel components
│   ├── services/        # Supabase API calls
│   ├── hooks/           # Custom React hooks
│   └── styles/          # Global CSS & themes
├── supabase/
│   ├── migrations/      # Database schema
│   └── seed.sql         # Initial data
└── dist/                # Production build (upload this)
```

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- Framer Motion (animations)
- Supabase (Auth, Database, Storage)
- PostgreSQL + RLS
- Lucide React (icons)

## License

Private project. 21+ only.
