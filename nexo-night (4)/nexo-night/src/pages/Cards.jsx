import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Search, Heart, Flame, MessageCircle, HelpCircle, Sword, Shirt } from 'lucide-react'
import { getCards } from '../services/games'

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

export default function Cards() {
  const [cards, setCards] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    const { data } = await getCards()
    setCards(data || [])
  }

  const filteredCards = cards.filter(card => {
    const matchesFilter = filter === 'all' || card.card_type === filter
    const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase()) ||
                         card.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const filters = ['all', 'truth', 'dare', 'flirt', 'challenge', 'choice', 'strip']

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">CARD COLLECTION</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-nexo-pink/50"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filter === f 
                ? 'bg-nexo-pink text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCards.map((card, i) => {
          const Icon = typeIcons[card.card_type] || HelpCircle
          const gradient = typeColors[card.card_type] || 'from-gray-500 to-gray-600'

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel p-4 hover:neon-border transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon size={18} className="text-white" />
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  card.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                  card.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  card.difficulty === 'hard' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {card.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-sm mb-1">{card.title}</h3>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{card.description}</p>

              <div className="flex items-center justify-between text-[10px]">
                <span className="text-nexo-gold">+{card.reward_nexo} N</span>
                <span className="text-nexo-purple">+{card.reward_xp} XP</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
