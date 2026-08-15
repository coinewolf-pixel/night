import { motion } from 'framer-motion'
import { Lock, Users, BookOpen, Flame, Heart, Clock } from 'lucide-react'

const modeIcons = {
  quick: Users,
  private: Lock,
  story: BookOpen,
  hot: Flame,
  couple: Heart
}

const modeColors = {
  quick: 'from-pink-500 to-rose-600',
  private: 'from-blue-500 to-indigo-600',
  story: 'from-purple-500 to-violet-600',
  hot: 'from-orange-500 to-red-600',
  couple: 'from-rose-400 to-pink-600'
}

export default function GameModeCard({ mode, onClick, disabled = false }) {
  const Icon = modeIcons[mode.id] || Users
  const gradient = modeColors[mode.id] || 'from-gray-500 to-gray-600'

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.03, y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={() => !disabled && onClick?.(mode)}
      className={`relative w-full text-left glass-panel p-4 transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:neon-border'
      }`}
    >
      {mode.isNew && (
        <div className="absolute -top-2 -right-2 bg-nexo-pink text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          NEW
        </div>
      )}
      {mode.comingSoon && (
        <div className="absolute -top-2 -right-2 bg-gray-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
          SOON
        </div>
      )}

      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3`}>
        <Icon size={20} className="text-white" />
      </div>

      <h3 className="font-bold text-sm mb-1">{mode.title}</h3>
      <p className="text-[11px] text-gray-400 mb-2">{mode.description}</p>

      {mode.onlineCount && (
        <div className="flex items-center gap-1 text-[10px] text-nexo-cyan">
          <Users size={10} />
          <span>ONLINE: {mode.onlineCount.toLocaleString()}</span>
        </div>
      )}

      {mode.minLevel && mode.minLevel > 1 && (
        <div className="flex items-center gap-1 text-[10px] text-nexo-gold mt-1">
          <Lock size={10} />
          <span>Level {mode.minLevel}+</span>
        </div>
      )}
    </motion.button>
  )
}
