import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../services/supabase'
import { isAdmin } from '../services/auth'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [admin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    if (data) setProfile(data)
  }, [])

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        const adminStatus = await isAdmin(session.user.id)
        setAdmin(adminStatus)
      }
      setLoading(false)
    }
    init()

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        const adminStatus = await isAdmin(session.user.id)
        setAdmin(adminStatus)
      } else {
        setUser(null)
        setProfile(null)
        setAdmin(false)
      }
      setLoading(false)
    })

    return () => listener.subscription.unsubscribe()
  }, [fetchProfile])

  return { user, profile, admin, loading, setProfile }
}
