import { supabase } from './supabase'

export const uploadImage = async (file, folder = 'general') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('game-assets')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('game-assets')
    .getPublicUrl(filePath)

  return publicUrl
}

export const deleteImage = async (path) => {
  const { error } = await supabase.storage
    .from('game-assets')
    .remove([path])
  return { error }
}
