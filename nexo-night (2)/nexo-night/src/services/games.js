import { requireClient } from './supabase'

export async function getMyResults(userId, limit = 20) {
  const c = requireClient()
  const { data, error } = await c.from('game_results')
    .select('*').eq('player_id', userId)
    .order('created_at', { ascending: false }).limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getMyProgress(userId) {
  const c = requireClient()
  const { data, error } = await c.from('player_progress').select('*').eq('player_id', userId)
  if (error) throw error
  return data ?? []
}
