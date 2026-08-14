import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

// Guardrail: never allow a service-role key in the frontend.
if (anon && anon.includes('service_role')) {
  throw new Error('Service role key must NEVER be used in the frontend.')
}

export const isConfigured = Boolean(url && anon)

// A single shared client. Uses only the public anon key (safe to ship).
export const supabase = isConfigured
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

export function requireClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Copy .env.example to .env and fill it in.')
  }
  return supabase
}
