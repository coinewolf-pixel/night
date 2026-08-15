import { supabase } from './supabase'

export const getAllModules = async () => {
  const { data, error } = await supabase
    .from('game_modules')
    .select('*')
    .order('sort_order')
  return { data, error }
}

export const createModule = async (moduleData) => {
  const { data, error } = await supabase
    .from('game_modules')
    .insert(moduleData)
    .select()
    .single()
  return { data, error }
}

export const updateModule = async (moduleId, updates) => {
  const { data, error } = await supabase
    .from('game_modules')
    .update(updates)
    .eq('id', moduleId)
    .select()
    .single()
  return { data, error }
}

export const deleteModule = async (moduleId) => {
  const { error } = await supabase
    .from('game_modules')
    .delete()
    .eq('id', moduleId)
  return { error }
}
