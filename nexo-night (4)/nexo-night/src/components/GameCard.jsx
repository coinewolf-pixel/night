import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Flame, MessageCircle, HelpCircle, Sword, Shirt } from 'lucide-react'

const typeIcons = {
  truth: MessageCircle,
  dare: Flame,
  choice: HelpCircle,
  challenge: Sword,
  flirt: Heart,
  strip: Shirt
}

const typeColors = {
  truth: 'from-blue-500 to-cyan-500',
  dare: 'from-red-500 to-pink-500',
  choice: 'from-yellow-500 to-orange-500',
  challenge: 'from-purple-500 to-pink-500',
  flirt: 'from-pink-500 to-rose-500',
  strip: 'from-red-600 to-orange-600'
}

export default function GameCard({ card, onSelect, flipped = false }) {
  const [isFlipped, setIsFlipped] = useState(flipped)
  const Icon = typeIcons[card.card_type] || HelpCircle
  const gradient = typeColors[card.card_type] || 'from-gray-500 to-gray-600'

  const handleClick = () => {
    if (!isFlipped) {
      setIsFlipped(true)
      setTimeout(() => onSelect?.(card), 600)
    }
  }

  return (
    <div className="card-flip w-full aspect-[3/4] cursor-pointer" onClick={handleClick}>
      <div className={`card-flip-inner relative w-full h-full ${isFlipped ? 'flipped' : ''}`}>
        {/* Front */}
        <div className="card-front absolute inset-0 glass-panel flex flex-col items-center justify-center p-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 shadow-lg`}>
            <Icon size={28} className="text-white" />
          </div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400">{card.card_type}</div>
          <div className="text-[10px] text-gray-500 mt-1">Tap to reveal</div>
          {card.difficulty && (
            <div className={`absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full ${
              card.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              card.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              card.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {card.difficulty}
            </div>
          )}
        </div>

        {/* Back */}
        <div className={`card-back absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} p-4 flex flex-col`}>
          <div className="flex items-center gap-2 mb-2">
            <Icon size={16} className="text-white/80" />
            <span className="text-[10px] font-bold uppercase text-white/80">{card.card_type}</span>
          </div>
          <h3 className="font-bold text-sm mb-2 text-white">{card.title}</h3>
          <p className="text-xs text-white/80 flex-1">{card.description}</p>
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
            <div className="text-[10px] text-white/60">+{card.reward_nexo} NEXO</div>
            <div className="text-[10px] text-white/60">+{card.reward_xp} XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}
