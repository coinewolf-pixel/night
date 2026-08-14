import { requireClient } from './supabase'

export async function listCards(moduleId, { activeOnly = true } = {}) {
  const c = requireClient()
  let q = c.from('game_cards').select('*')
  if (moduleId) q = q.eq('module_id', moduleId)
  if (activeOnly) q = q.eq('is_active', true)
  const { data, error } = await q.order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}

// Secure: only sends the card id. Reward is computed server-side.
export async function completeCard(cardId, result = 'completed') {
  const c = requireClient()
  const { data, error } = await c.rpc('complete_card', { p_card_id: cardId, p_result: result })
  if (error) throw error
  return data // updated profile row
}

export async function createCard(payload) {
  const c = requireClient()
  const { data, error } = await c.from('game_cards').insert(payload).select().single()
  if (error) throw error
  return data
}
export async function updateCard(id, patch) {
  const c = requireClient()
  const { data, error } = await c.from('game_cards').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}
export async function deleteCard(id) {
  const c = requireClient()
  const { error } = await c.from('game_cards').delete().eq('id', id)
  if (error) throw error
}
