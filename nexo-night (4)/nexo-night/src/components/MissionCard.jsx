import { motion } from 'framer-motion'
import { Target, Check } from 'lucide-react'

export default function MissionCard({ mission, progress = 0, completed = false, claimed = false, onClaim }) {
  const percent = Math.min(100, (progress / mission.target_count) * 100)

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass-panel p-4"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-nexo-pink" />
          <div>
            <h3 className="font-semibold text-sm">{mission.title}</h3>
            <p className="text-[11px] text-gray-400">{mission.description}</p>
          </div>
        </div>

        {claimed && (
          <div className="flex items-center gap-1 text-nexo-success text-[10px]">
            <Check size={12} /> Claimed
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="h-full bg-gradient-to-r from-nexo-pink to-nexo-purple rounded-full"
          />
        </div>
        <span className="text-[10px] text-gray-400 whitespace-nowrap">
          {progress}/{mission.target_count}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-nexo-gold">+{mission.reward_nexo} NEXO</span>
          <span className="text-nexo-purple">+{mission.reward_xp} XP</span>
        </div>

        {completed && !claimed && (
          <button onClick={onClaim} className="btn-primary text-[10px] py-1.5 px-3">
            CLAIM
          </button>
        )}
      </div>
    </motion.div>
  )
}
