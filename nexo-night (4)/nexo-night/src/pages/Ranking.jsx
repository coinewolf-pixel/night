import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, ArrowUp } from 'lucide-react'
import { getRanking } from '../services/players'
import { useAuth } from '../hooks/useAuth'

const tierColors = {
  bronze: 'text-amber-700',
  silver: 'text-gray-300',
  gold: 'text-yellow-400',
  platinum: 'text-cyan-300',
  diamond: 'text-blue-400',
  legend: 'text-nexo-pink'
}

const tierIcons = {
  bronze: Medal,
  silver: Medal,
  gold: Trophy,
  platinum: Crown,
  diamond: Crown,
  legend: Crown
}

export default function Ranking() {
  const { user } = useAuth()
  const [players, setPlayers] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRanking()
  }, [])

  const fetchRanking = async () => {
    const { data } = await getRanking(50)
    setPlayers(data || [])
  }

  const filtered = filter === 'all' ? players : players.filter(p => p.rank_tier === filter)

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Trophy size={24} className="text-nexo-gold" />
        RANKING
      </h1>
      <p className="text-sm text-gray-400 mb-6">Top players worldwide</p>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {['all', 'bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend'].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilter(tier)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize whitespace-nowrap transition-all ${
              filter === tier ? 'bg-nexo-pink text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((player, i) => {
          const TierIcon = tierIcons[player.rank_tier] || Medal
          const isMe = user?.id === player.player_id

          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`glass-panel p-3 flex items-center gap-3 ${isMe ? 'neon-border border-nexo-pink/30' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                i === 1 ? 'bg-gray-300/20 text-gray-300' :
                i === 2 ? 'bg-amber-700/20 text-amber-600' :
                'bg-white/5 text-gray-400'
              }`}>
                {i + 1}
              </div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-sm font-bold flex-shrink-0">
                {player.profiles?.username?.[0]?.toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">
                  {player.profiles?.username}
                  {isMe && <span className="text-nexo-pink text-xs ml-2">(You)</span>}
                </div>
                <div className="text-[10px] text-gray-400">Level {player.profiles?.level} • {player.total_games} games</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-sm text-nexo-gold">{player.total_wins} W</div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <TierIcon size={10} className={tierColors[player.rank_tier]} />
                  <span className={tierColors[player.rank_tier]}>{player.rank_tier}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
