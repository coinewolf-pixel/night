import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

export const usePlayer = (playerId) => {
  const [player, setPlayer] = useState(null)
  const [ranking, setRanking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!playerId) return

    const fetchPlayer = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', playerId)
        .single()

      const { data: rank } = await supabase
        .from('ranking')
        .select('*')
        .eq('player_id', playerId)
        .single()

      setPlayer(profile)
      setRanking(rank)
      setLoading(false)
    }

    fetchPlayer()

    const channel = supabase
      .channel(`player_${playerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${playerId}` },
        (payload) => setPlayer(payload.new)
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [playerId])

  return { player, ranking, loading }
}
