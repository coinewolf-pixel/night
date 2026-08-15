import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, CreditCard, Layers, Trophy } from 'lucide-react'
import { supabase } from '../services/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ players: 0, cards: 0, modules: 0, games: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const [
      { count: players },
      { count: cards },
      { count: modules },
      { count: games },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('game_cards').select('*', { count: 'exact', head: true }),
      supabase.from('game_modules').select('*', { count: 'exact', head: true }),
      supabase.from('game_results').select('*', { count: 'exact', head: true }),
    ])
    setStats({ players: players || 0, cards: cards || 0, modules: modules || 0, games: games || 0 })
  }

  const statCards = [
    { label: 'Total Players', value: stats.players, icon: Users, color: 'from-blue-500 to-cyan-500' },
    { label: 'Game Cards', value: stats.cards, icon: CreditCard, color: 'from-pink-500 to-rose-500' },
    { label: 'Modules', value: stats.modules, icon: Layers, color: 'from-purple-500 to-violet-500' },
    { label: 'Games Played', value: stats.games, icon: Trophy, color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-panel p-4"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
            <stat.icon size={20} className="text-white" />
          </div>
          <div className="text-2xl font-black">{stat.value}</div>
          <div className="text-xs text-gray-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  )
}
