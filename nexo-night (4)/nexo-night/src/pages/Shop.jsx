import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Gem, Coins, Crown, Star } from 'lucide-react'

const shopItems = [
  { id: 1, name: 'Gem Pack S', description: '50 Gems', price: 499, type: 'gems', value: 50, icon: Gem, color: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'Gem Pack M', description: '150 Gems', price: 999, type: 'gems', value: 150, icon: Gem, color: 'from-purple-600 to-pink-600' },
  { id: 3, name: 'Gem Pack L', description: '500 Gems', price: 2499, type: 'gems', value: 500, icon: Gem, color: 'from-purple-700 to-pink-700' },
  { id: 4, name: 'Coin Boost', description: '1000 NEXO', price: 299, type: 'coins', value: 1000, icon: Coins, color: 'from-yellow-500 to-orange-500' },
  { id: 5, name: 'Mega Coins', description: '5000 NEXO', price: 999, type: 'coins', value: 5000, icon: Coins, color: 'from-yellow-600 to-orange-600' },
  { id: 6, name: 'VIP Pass', description: '7 Days VIP', price: 599, type: 'vip', value: 7, icon: Crown, color: 'from-nexo-pink to-nexo-purple' },
  { id: 7, name: 'Energy Refill', description: 'Full Energy', price: 99, type: 'energy', value: 10, icon: Star, color: 'from-cyan-500 to-blue-500' },
]

export default function Shop() {
  const [category, setCategory] = useState('all')
  const categories = ['all', 'gems', 'coins', 'vip']

  const filtered = category === 'all' ? shopItems : shopItems.filter(i => i.type === category || (category === 'vip' && i.type === 'vip'))

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <ShoppingBag size={24} className="text-nexo-pink" />
        SHOP
      </h1>
      <p className="text-sm text-gray-400 mb-6">Get more items and upgrades</p>

      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
              category === cat ? 'bg-nexo-pink text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((item, i) => {
          const Icon = item.icon
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-4 flex items-center gap-4 hover:neon-border transition-all"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{item.name}</h3>
                <p className="text-xs text-gray-400">{item.description}</p>
              </div>
              <button className="btn-primary text-xs py-2 px-4 flex-shrink-0">
                ${(item.price / 100).toFixed(2)}
              </button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
