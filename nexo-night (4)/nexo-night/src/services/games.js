import { supabase } from './supabase'

export const getModules = async () => {
  const { data, error } = await supabase
    .from('game_modules')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  return { data, error }
}

export const getCards = async (moduleId = null) => {
  let query = supabase
    .from('game_cards')
    .select('*')
    .eq('is_active', true)

  if (moduleId) {
    query = query.eq('module_id', moduleId)
  }

  const { data, error } = await query.order('created_at')
  return { data, error }
}

export const getCardById = async (cardId) => {
  const { data, error } = await supabase
    .from('game_cards')
    .select('*, game_modules(*)')
    .eq('id', cardId)
    .single()
  return { data, error }
}

export const getPlayerProgress = async (playerId) => {
  const { data, error } = await supabase
    .from('player_progress')
    .select('*')
    .eq('player_id', playerId)
  return { data, error }
}

export const submitGameResult = async (playerId, cardId, result) => {
  const { data, error } = await supabase.rpc('process_game_result', {
    p_player_id: playerId,
    p_card_id: cardId,
    p_result: result
  })
  return { data, error }
}

export const getGameResults = async (playerId, limit = 20) => {
  const { data, error } = await supabase
    .from('game_results')
    .select('*, game_cards(title), game_modules(title)')
    .eq('player_id', playerId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

export const getDailyMissions = async () => {
  const { data, error } = await supabase
    .from('daily_missions')
    .select('*')
    .eq('is_active', true)
  return { data, error }
}

export const getPlayerMissions = async (playerId) => {
  const { data, error } = await supabase
    .from('player_missions')
    .select('*, daily_missions(*)')
    .eq('player_id', playerId)
  return { data, error }
}
