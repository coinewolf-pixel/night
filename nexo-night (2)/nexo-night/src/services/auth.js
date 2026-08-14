import { requireClient, supabase } from './supabase'

export async function signUp({ email, password, username }) {
  const c = requireClient()
  const { data, error } = await c.auth.signUp({
    email, password, options: { data: { username } },
  })
  if (error) throw error
  return data
}

export async function signIn({ email, password }) {
  const c = requireClient()
  const { data, error } = await c.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthChange(cb) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session))
  return () => data.subscription.unsubscribe()
}

export async function isAdmin(userId) {
  if (!supabase || !userId) return false
  const { data } = await supabase
    .from('admin_users').select('id').eq('user_id', userId).maybeSingle()
  return Boolean(data)
}
