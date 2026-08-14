import { requireClient } from './supabase'

export async function getProfile(userId) {
  const c = requireClient()
  const { data, error } = await c.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (error) throw error
  return data
}

// Cosmetic-only update (username / avatar). Economy fields are DB-protected.
export async function updateProfileCosmetic(userId, patch) {
  const c = requireClient()
  const allowed = {}
  if ('username' in patch) allowed.username = patch.username
  if ('avatar_url' in patch) allowed.avatar_url = patch.avatar_url
  const { data, error } = await c.from('profiles')
    .update(allowed).eq('id', userId).select().single()
  if (error) throw error
  return data
}

export async function getLeaderboard(limit = 50) {
  const c = requireClient()
  const { data, error } = await c.from('profiles')
    .select('id, username, avatar_url, level, xp, nexo_coins')
    .order('xp', { ascending: false }).limit(limit)
  if (error) throw error
  return data ?? []
}
