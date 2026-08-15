import { motion } from 'framer-motion'
import { Lock, Check } from 'lucide-react'

export default function RewardCard({ reward, claimed = false, canClaim = false, onClaim }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass-panel p-4 relative overflow-hidden ${
        claimed ? 'border-nexo-success/30' : canClaim ? 'neon-border' : ''
      }`}
    >
      {claimed && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-nexo-success/20 flex items-center justify-center">
          <Check size={14} className="text-nexo-success" />
        </div>
      )}

      <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-nexo-purple/20 to-nexo-pink/20 flex items-center justify-center mb-3 overflow-hidden">
        {reward.image_url ? (
          <img src={reward.image_url} alt={reward.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-3xl">🎁</span>
        )}
      </div>

      <h3 className="font-bold text-sm mb-1">{reward.title}</h3>
      <p className="text-[11px] text-gray-400 mb-2">{reward.description}</p>

      <div className="flex items-center justify-between">
        <div className="text-[10px] text-gray-500">
          {reward.reward_type === 'coins' && `+${reward.reward_value} NEXO`}
          {reward.reward_type === 'gems' && `+${reward.reward_value} Gems`}
          {reward.reward_type === 'avatar' && 'Avatar Frame'}
          {reward.reward_type === 'background' && 'Background'}
          {reward.reward_type === 'card_skin' && 'Card Skin'}
        </div>

        {!claimed && canClaim && (
          <button onClick={onClaim} className="btn-primary text-[10px] py-1.5 px-3">
            CLAIM
          </button>
        )}

        {!claimed && !canClaim && (
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Lock size={10} />
            <span>Level {reward.required_level}</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
