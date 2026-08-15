# Supabase Setup for NEXO NIGHT

## Step 1: Create Project
1. Go to https://supabase.com
2. Create new project
3. Note your Project URL and Anon Key

## Step 2: Run Migrations
1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `migrations/001_initial_schema.sql`
3. Run the SQL

## Step 3: Seed Data
1. In SQL Editor, run `seed.sql`

## Step 4: Storage Bucket
1. Go to Storage → New Bucket
2. Name: `game-assets`
3. Set to Public
4. Create folders: `modules/`, `cards/`, `avatars/`, `rewards/`, `backgrounds/`

## Step 5: Create First Admin
1. Register a user through the app
2. In SQL Editor run:
   ```sql
   INSERT INTO admin_users (user_id) 
   SELECT id FROM auth.users WHERE email = 'your-email@example.com';
   ```

## Step 6: Environment Variables
Copy from Settings → API:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
