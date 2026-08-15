import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Shield } from 'lucide-react'
import { getAllPlayers } from '../services/players'
import { supabase } from '../services/supabase'

export default function AdminPlayers() {
  const [players, setPlayers] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    const { data } = await getAllPlayers()
    setPlayers(data || [])
  }

  const toggleAdmin = async (userId) => {
    const { data: existing } = await supabase.from('admin_users').select('id').eq('user_id', userId).single()
    if (existing) {
      await supabase.from('admin_users').delete().eq('user_id', userId)
    } else {
      await supabase.from('admin_users').insert({ user_id: userId })
    }
    fetchPlayers()
  }

  const filtered = players.filter(p => 
    p.username?.toLowerCase().includes(search.toLowerCase()) ||
    p.id?.includes(search)
  )

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Players</h2>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search players..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm"
        />
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {filtered.map((player) => (
          <motion.div key={player.id} className="glass-panel p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-sm font-bold">
                {player.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-sm">{player.username}</div>
                <div className="text-[10px] text-gray-400">Level {player.level} &bull; {player.nexo_coins} NEXO</div>
              </div>
            </div>
            <button 
              onClick={() => toggleAdmin(player.id)} 
              className="p-2 rounded-lg hover:bg-white/5"
              title="Toggle Admin"
            >
              <Shield size={16} className="text-gray-500" />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
