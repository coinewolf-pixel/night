import { useNavigate } from 'react-router-dom'
import { Edit3, Zap } from 'lucide-react'

export default function PlayerProfile({ profile }) {
  const navigate = useNavigate()
  if (!profile) return null

  const xpPercent = Math.min(100, (profile.xp / (profile.level * 100)) * 100)

  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-xl font-bold">
            {profile.username?.[0]?.toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-nexo-dark border-2 border-nexo-gold flex items-center justify-center text-[10px] font-bold text-nexo-gold">
            {profile.level}
          </div>
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">{profile.username?.toUpperCase()}</div>
          <div className="text-[10px] text-gray-400">LEVEL {profile.level}</div>
        </div>
        <button onClick={() => navigate('/profile')} className="p-2 rounded-lg hover:bg-white/5">
          <Edit3 size={16} />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>XP</span>
          <span>{profile.xp} / {profile.level * 100}</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-nexo-pink to-nexo-purple rounded-full transition-all duration-500"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 text-xs">
        <Zap size={14} className="text-nexo-cyan" />
        <span className="text-gray-400">Energy:</span>
        <span className="font-semibold">{profile.energy}/{profile.energy_max}</span>
      </div>
    </div>
  )
}
