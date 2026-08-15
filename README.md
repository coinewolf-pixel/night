# NEXO NIGHT

A static **React + Vite** frontend for an adult (21+) truth-or-dare social game.
All game state (players, coins, XP, levels, modules, cards, rewards) lives in
**Supabase / PostgreSQL** — never in localStorage. After `npm run build` you can
drag-and-drop the `dist/` folder onto Netlify or Cloudflare Pages.

> The production frontend is **fully static**. Node.js is only needed for
> `npm install` and `npm run build`. There is no Node backend to run.

---

## Quick map: what goes where

| Piece | Destination |
| --- | --- |
| `dist/` (after build) | **Netlify / Cloudflare Pages** (drag & drop) |
| `supabase/migrations/001_initial_schema.sql` | **Supabase → SQL Editor** (run once) |
| `supabase/seed.sql` | **Supabase → SQL Editor** (run once, demo content) |
| Storage bucket `game-assets` | **Supabase → Storage** (create manually) |
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | `.env` (local) **and** host env vars |

**Never** put `SUPABASE_SERVICE_ROLE_KEY` in this project. Only the public
**anon** key belongs in the frontend.

---

## Setup — step by step

### STEP 1 — Create a Supabase project
Go to https://supabase.com and create a new project.

### STEP 2 — Open the SQL Editor
Project → **SQL Editor** → New query.

### STEP 3 — Run the schema
Paste and run `supabase/migrations/001_initial_schema.sql`.
This creates all tables, RLS policies, and the secure reward functions.

### STEP 4 — Run the seed
Paste and run `supabase/seed.sql` to load demo modules, cards, missions and rewards.

### STEP 5 — Create the Storage bucket
Storage → **New bucket** → name it `game-assets`, mark it **Public**.
Then run the Storage policies shown in `supabase/README.md` so players can read
and only admins can upload. Folders (`modules/`, `cards/`, `avatars/`,
`rewards/`, `backgrounds/`) are created automatically on first upload.

### STEP 6 — Create `.env`
Copy `.env.example` to `.env` and fill in from Project Settings → API:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-PUBLIC-ANON-KEY
```

### STEP 7 — Run locally
```
npm install
npm run dev
```
Open the printed URL, register an account, and sign in.

### STEP 8 — Build for production
```
npm run build
```
This produces the `dist/` folder.

### STEP 9 — Deploy
Drag `dist/` onto **Netlify** (Sites → drag & drop) or **Cloudflare Pages**
(Create → Direct Upload). Add the two `VITE_*` variables in the host's
environment settings **only if** you build on the host; for a pre-built `dist`
drop, the values are already baked in at build time.

**SPA routing:** on Netlify add a `_redirects` file with `/*  /index.html  200`
(already handled by most hosts for Vite SPAs). Cloudflare Pages does this by default.

---

## How to create the first admin

1. Register your account in the app.
2. In Supabase → SQL Editor run (replace the email):

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;
```

3. Reload the app — an **Admin** button appears in the header, and `/admin` unlocks.

---

## Security model (why cheating doesn't work)

- **RLS is on for every table.** Players can only read allowed content and their
  own rows.
- **Economy fields are read-only from the client.** A trigger on `profiles`
  rejects any non-admin update that changes `nexo_coins`, `xp`, `level`, or `gems`.
- **Rewards come from the database, not the browser.** The client calls
  `complete_card(card_id)` — a `SECURITY DEFINER` function that looks up the
  card's reward in the DB and credits it. Sending `reward = 999999999` is
  impossible because the browser never sends an amount at all.
- **`game_results` has no insert policy** — only the secure function can write it.
- **Admin actions** are gated by an `is_admin()` check in both RLS and the UI.

---

## Multi-user

Every account has its own `profiles` row keyed to `auth.users.id`. Sign in from
any device and your saved progress loads from Supabase. When an admin adds a new
module or card, it appears for all players on next load — **no rebuild needed**.

---

## Project structure

```
nexo-night/
├── public/            static assets + favicon
├── src/
│   ├── components/     UI building blocks (Header, Sidebar, cards, modal…)
│   ├── pages/          routes (Home, Play, Cards, Rewards, Ranking, Profile, Login, Register, Admin)
│   ├── admin/          admin dashboard + CRUD panels
│   ├── services/       Supabase client + typed data access (auth, players, cards, …)
│   ├── hooks/          useAuth (context), usePlayer, useGame
│   ├── styles/         theme + global + responsive CSS
│   ├── App.jsx / router.jsx / main.jsx
├── supabase/          SQL migration, seed, storage notes
├── .env.example
└── vite.config.js
```

## Notes / next steps
- Shop purchases and daily-reward claiming ladders are UI-wired but should be
  backed by their own secure RPCs before real money or economy is involved.
- Mission progress tracking (incrementing toward `target`) is where you'd add a
  server-side hook; claiming already runs through the secure `claim_mission` RPC.
