import { requireClient } from './supabase'

export async function listModules({ activeOnly = true } = {}) {
  const c = requireClient()
  let q = c.from('game_modules').select('*').order('sort_order', { ascending: true })
  if (activeOnly) q = q.eq('is_active', true)
  const { data, error } = await q
  if (error) throw error
  return data ?? []
}

export async function createModule(payload) {
  const c = requireClient()
  const { data, error } = await c.from('game_modules').insert(payload).select().single()
  if (error) throw error
  return data
}
export async function updateModule(id, patch) {
  const c = requireClient()
  const { data, error } = await c.from('game_modules').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}
export async function deleteModule(id) {
  const c = requireClient()
  const { error } = await c.from('game_modules').delete().eq('id', id)
  if (error) throw error
}
