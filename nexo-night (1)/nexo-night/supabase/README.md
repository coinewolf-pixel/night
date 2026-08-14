# Supabase setup for NEXO NIGHT

1. Create a project at https://supabase.com.
2. Open **SQL Editor** and run `migrations/001_initial_schema.sql`.
3. Run `seed.sql` to load demo modules, cards, missions and rewards.
4. Create a **public** Storage bucket named `game-assets`. Inside it, create
   folders: `modules/`, `cards/`, `avatars/`, `rewards/`, `backgrounds/`.
   (Folders are created automatically on first upload.)
5. Grab **Project URL** and **anon public key** from Project Settings → API and
   put them into the frontend `.env`.

## Make the first admin
After you register your first account in the app, run this in SQL Editor
(replace the email):

```sql
insert into public.admin_users (user_id)
select id from auth.users where email = 'you@example.com'
on conflict (user_id) do nothing;
```

## Storage policies (run once, so players can read and admins can upload)
```sql
-- public read
create policy "public read game-assets"
on storage.objects for select
using ( bucket_id = 'game-assets' );

-- only admins can write
create policy "admin write game-assets"
on storage.objects for insert to authenticated
with check ( bucket_id = 'game-assets' and public.is_admin() );
```
