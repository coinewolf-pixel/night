import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronRight, Gift, Target, Trophy, ShoppingBag, Crown, Lock, Heart } from 'lucide-react'
import PlayButton from '../components/PlayButton'
import PlayerProfile from '../components/PlayerProfile'
import GameModeCard from '../components/GameModeCard'
import MissionCard from '../components/MissionCard'
import { useAuth } from '../hooks/useAuth'
import { useGame } from '../hooks/useGame'
import { getPlayerMissions } from '../services/games'

const gameModes = [
  { id: 'quick', title: 'QUICK MATCH', description: 'Find random partner', onlineCount: 1245, isNew: false },
  { id: 'private', title: 'PRIVATE ROOM', description: 'Play with friends', minLevel: 2, isNew: false },
  { id: 'story', title: 'STORY MODE', description: 'Levels & adventures', isNew: true },
  { id: 'hot', title: 'HOT CHALLENGES', description: 'Dares & more', minLevel: 5, isNew: true },
  { id: 'couple', title: 'COUPLE MODE', description: 'For couples', comingSoon: true },
]

const dailyRewards = [
  { day: 1, amount: 100, claimed: true },
  { day: 2, amount: 150, claimed: false, current: true },
  { day: 3, amount: 200, claimed: false },
  { day: 4, amount: 250, claimed: false },
  { day: 5, amount: 500, claimed: false },
]

export default function Home() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { missions, playerMissions } = useGame(user?.id)
  const [timeLeft, setTimeLeft] = useState('14h 25m 30s')
  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      const diff = tomorrow - now
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${h}h ${m}m ${s}s`)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mb-6 min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="absolute inset-0 bg-gradient-to-b from-nexo-purple/20 via-nexo-pink/10 to-nexo-dark" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800')] bg-cover bg-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-nexo-darker via-transparent to-transparent" />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-nexo-pink/60"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.3 }}
            style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-2">
            <span className="neon-text">NEXO</span>
          </h1>
          <h2 className="text-3xl sm:text-5xl font-black text-nexo-pink neon-text mb-4">
            NIGHT
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold border border-white/20">21+</span>
            <Heart size={14} className="text-nexo-pink" />
            <span className="text-sm text-gray-300">FLIRT. PLAY. DARE. WIN.</span>
            <Heart size={14} className="text-nexo-pink" />
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex flex-col items-center justify-center border-2 border-white/20 shadow-lg shadow-red-500/20">
              <Flame size={24} className="text-white mb-1" />
              <span className="text-xs font-bold text-white">DARE</span>
            </div>
            <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex flex-col items-center justify-center border-2 border-white/20 shadow-lg shadow-blue-500/20">
              <span className="text-lg font-black text-white">TRUTH</span>
              <MessageCircle size={20} className="text-white/80 mt-1" />
            </div>
          </div>

          <p className="text-xs text-gray-400 mb-6">CHOOSE A CARD. ACCEPT THE CHALLENGE.</p>

          <PlayButton onClick={() => navigate('/play')} size="large" />

          <p className="text-[10px] text-gray-500 mt-4">Find your partner. Start the fun.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Modes */}
          <div>
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Play size={18} className="text-nexo-pink" />
              GAME MODES
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gameModes.map((mode) => (
                <GameModeCard
                  key={mode.id}
                  mode={mode}
                  onClick={(m) => navigate(`/play?mode=${m.id}`)}
                  disabled={mode.comingSoon || (mode.minLevel && profile?.level < mode.minLevel)}
                />
              ))}
            </div>
          </div>

          {/* Daily Challenges */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Target size={18} className="text-nexo-purple" />
                DAILY CHALLENGES
              </h2>
              <button className="text-xs text-nexo-pink flex items-center gap-1">
                VIEW ALL <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-2">
              {missions.slice(0, 3).map((mission) => {
                const pm = playerMissions.find(pm => pm.mission_id === mission.id)
                return (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    progress={pm?.progress || 0}
                    completed={pm?.completed || false}
                    claimed={pm?.claimed || false}
                  />
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Player Profile */}
          {profile && <PlayerProfile profile={profile} />}

          {/* Daily Rewards */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Gift size={16} className="text-nexo-gold" />
                DAILY REWARDS
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock size={12} />
                {timeLeft}
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {dailyRewards.map((reward) => (
                <div
                  key={reward.day}
                  className={`text-center p-2 rounded-lg border ${
                    reward.claimed 
                      ? 'bg-nexo-success/10 border-nexo-success/30' 
                      : reward.current
                      ? 'bg-nexo-pink/10 border-nexo-pink/50 neon-border'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="text-[9px] text-gray-400 mb-1">DAY {reward.day}</div>
                  <div className="text-lg mb-1">{reward.claimed ? '✓' : reward.current ? '🎁' : '📦'}</div>
                  <div className="text-[9px] text-nexo-gold">{reward.amount} N</div>
                </div>
              ))}
            </div>
            <button className="w-full btn-primary mt-3 text-sm py-2">CLAIM REWARD</button>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <button onClick={() => navigate('/shop')} className="w-full glass-panel p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <ShoppingBag size={18} className="text-nexo-pink" />
              <div>
                <div className="font-semibold text-sm">SHOP</div>
                <div className="text-[10px] text-gray-400">Buy items & upgrades</div>
              </div>
            </button>
            <button onClick={() => navigate('/ranking')} className="w-full glass-panel p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <Trophy size={18} className="text-nexo-gold" />
              <div>
                <div className="font-semibold text-sm">RANKING</div>
                <div className="text-[10px] text-gray-400">See top players</div>
              </div>
            </button>
            <button onClick={() => navigate('/vip')} className="w-full glass-panel p-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left">
              <Crown size={18} className="text-nexo-purple" />
              <div>
                <div className="font-semibold text-sm">VIP CLUB</div>
                <div className="text-[10px] text-gray-400">Exclusive benefits</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
