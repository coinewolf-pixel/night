import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSession, onAuthChange, isAdmin, signOut as doSignOut } from '../services/auth'
import { getProfile } from '../services/players'
import { isConfigured } from '../services/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) { setProfile(null); setAdmin(false); return }
    try {
      const [p, a] = await Promise.all([getProfile(userId), isAdmin(userId)])
      setProfile(p); setAdmin(a)
    } catch (e) {
      console.error('profile load failed', e)
    }
  }, [])

  useEffect(() => {
    let active = true
    if (!isConfigured) { setLoading(false); return }
    getSession().then(async (s) => {
      if (!active) return
      setSession(s)
      await loadProfile(s?.user?.id)
      setLoading(false)
    })
    const unsub = onAuthChange(async (s) => {
      setSession(s)
      await loadProfile(s?.user?.id)
    })
    return () => { active = false; unsub() }
  }, [loadProfile])

  const refreshProfile = useCallback(() => loadProfile(session?.user?.id), [session, loadProfile])

  const signOut = useCallback(async () => {
    await doSignOut()
    setSession(null); setProfile(null); setAdmin(false)
  }, [])

  const value = {
    session, user: session?.user ?? null,
    profile, setProfile, admin, loading,
    configured: isConfigured,
    refreshProfile, signOut,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
