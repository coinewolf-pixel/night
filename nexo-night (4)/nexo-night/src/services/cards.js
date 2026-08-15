import { supabase } from './supabase'

export const getAllCards = async () => {
  const { data, error } = await supabase
    .from('game_cards')
    .select('*, game_modules(title)')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const createCard = async (cardData) => {
  const { data, error } = await supabase
    .from('game_cards')
    .insert(cardData)
    .select()
    .single()
  return { data, error }
}

export const updateCard = async (cardId, updates) => {
  const { data, error } = await supabase
    .from('game_cards')
    .update(updates)
    .eq('id', cardId)
    .select()
    .single()
  return { data, error }
}

export const deleteCard = async (cardId) => {
  const { error } = await supabase
    .from('game_cards')
    .delete()
    .eq('id', cardId)
  return { error }
}
