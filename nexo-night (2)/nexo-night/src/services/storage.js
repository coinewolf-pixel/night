import { requireClient } from './supabase'

const BUCKET = 'game-assets'

// Admin-only in practice (Storage RLS enforces it). Returns a public URL.
export async function uploadImage(folder, file) {
  const c = requireClient()
  const ext = file.name.split('.').pop()
  const path = `${folder}/${crypto.randomUUID()}.${ext}`
  const { error } = await c.storage.from(BUCKET).upload(path, file, { upsert: false })
  if (error) throw error
  const { data } = c.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
