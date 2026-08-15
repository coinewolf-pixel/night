import { supabase } from './supabase'

export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return { data, error }
}

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export const getRanking = async (limit = 50) => {
  const { data, error } = await supabase
    .from('ranking')
    .select('*, profiles(username, avatar_url, level)')
    .order('total_wins', { ascending: false })
    .limit(limit)
  return { data, error }
}

export const getAllPlayers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, ranking(*)')
    .order('created_at', { ascending: false })
  return { data, error }
}
