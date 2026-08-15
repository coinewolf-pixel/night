import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Shuffle, Check, X, Trophy, Zap, Heart, Flame, Shirt } from 'lucide-react'
import GameCard from '../components/GameCard'
import Modal from '../components/Modal'
import { useAuth } from '../hooks/useAuth'
import { getModules, getCards, submitGameResult } from '../services/games'

const cardTypeColors = {
  truth: 'from-blue-500 to-cyan-500',
  dare: 'from-red-500 to-pink-500',
  choice: 'from-yellow-500 to-orange-500',
  challenge: 'from-purple-500 to-pink-500',
  flirt: 'from-pink-500 to-rose-500',
  strip: 'from-red-600 to-orange-600'
}

export default function Play() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [step, setStep] = useState('modes') // modes, modules, cards, game, result
  const [modules, setModules] = useState([])
  const [cards, setCards] = useState([])
  const [selectedModule, setSelectedModule] = useState(null)
  const [currentCard, setCurrentCard] = useState(null)
  const [gameResult, setGameResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showStrip, setShowStrip] = useState(false)
  const [stripItem, setStripItem] = useState(null)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    const { data } = await getModules()
    setModules(data || [])
  }

  const handleSelectModule = async (module) => {
    setSelectedModule(module)
    setLoading(true)
    const { data } = await getCards(module.id)
    setCards(data || [])
    setLoading(false)
    setStep('cards')
  }

  const handleSelectCard = (card) => {
    setCurrentCard(card)
    setStep('game')
  }

  const handleComplete = async (result) => {
    if (!user || !currentCard) return
    setLoading(true)

    const { data } = await submitGameResult(user.id, currentCard.id, result)

    if (data?.success) {
      setGameResult(data)
      if (data.strip_item) {
        setStripItem(data.strip_item)
        setShowStrip(true)
      }
      setStep('result')
    }
    setLoading(false)
  }

  const handleNextCard = () => {
    setCurrentCard(null)
    setGameResult(null)
    setShowStrip(false)
    setStripItem(null)
    setStep('cards')
  }

  const getStripEmoji = (item) => {
    const map = { top: '👕', bottom: '👖', shoes: '👟', accessory: '💍' }
    return map[item] || '👕'
  }

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-4xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => {
          if (step === 'modes') navigate('/')
          else if (step === 'modules') setStep('modes')
          else if (step === 'cards') setStep('modules')
          else if (step === 'game') setStep('cards')
          else if (step === 'result') setStep('cards')
        }} className="p-2 rounded-lg hover:bg-white/5">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">
          {step === 'modes' && 'SELECT MODE'}
          {step === 'modules' && 'SELECT LEVEL'}
          {step === 'cards' && `${selectedModule?.title?.toUpperCase() || 'CARDS'}`}
          {step === 'game' && 'YOUR CHALLENGE'}
          {step === 'result' && 'RESULT'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {/* GAME MODES */}
        {step === 'modes' && (
          <motion.div
            key="modes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { id: 'quick', title: 'QUICK MATCH', desc: 'Random card from any level', icon: Shuffle, color: 'from-pink-500 to-rose-600' },
                { id: 'story', title: 'STORY MODE', desc: 'Progress through all levels', icon: Trophy, color: 'from-purple-500 to-violet-600' },
              ].map((mode) => (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('modules')}
                  className="glass-panel p-6 text-left hover:neon-border transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3`}>
                    <mode.icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{mode.title}</h3>
                  <p className="text-sm text-gray-400">{mode.desc}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* MODULES / LEVELS */}
        {step === 'modules' && (
          <motion.div
            key="modules"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-gray-400">Levels:</span>
              {['flirt', 'hot', 'dare', 'finale'].map((cat) => (
                <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 uppercase">
                  {cat}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((module, i) => {
                const locked = profile?.level < module.min_level
                const categoryColors = {
                  flirt: 'from-pink-400/20 to-rose-500/20 border-pink-500/30',
                  hot: 'from-orange-400/20 to-red-500/20 border-orange-500/30',
                  dare: 'from-red-500/20 to-purple-500/20 border-red-500/30',
                  finale: 'from-purple-500/20 to-blue-500/20 border-purple-500/30',
                  special: 'from-cyan-400/20 to-blue-500/20 border-cyan-500/30',
                }

                return (
                  <motion.button
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!locked ? { scale: 1.02 } : {}}
                    onClick={() => !locked && handleSelectModule(module)}
                    className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                      locked 
                        ? 'opacity-50 cursor-not-allowed bg-white/5 border-white/10' 
                        : `bg-gradient-to-br ${categoryColors[module.category] || categoryColors.flirt} cursor-pointer hover:shadow-lg`
                    }`}
                  >
                    {locked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="text-center">
                          <span className="text-2xl">🔒</span>
                          <p className="text-xs mt-1">Level {module.min_level}+</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        module.category === 'flirt' ? 'bg-pink-500/20 text-pink-400' :
                        module.category === 'hot' ? 'bg-orange-500/20 text-orange-400' :
                        module.category === 'dare' ? 'bg-red-500/20 text-red-400' :
                        module.category === 'finale' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {module.category}
                      </span>
                      <span className="text-[10px] text-gray-400">+{module.reward_nexo} N</span>
                    </div>

                    <h3 className="font-bold text-lg mb-1">{module.title}</h3>
                    <p className="text-xs text-gray-400 mb-3">{module.description}</p>

                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Zap size={10} />
                      <span>+{module.reward_xp} XP</span>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* CARDS */}
        {step === 'cards' && (
          <motion.div
            key="cards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="text-sm text-gray-400 mb-4">Tap a card to reveal your challenge</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cards.map((card, i) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, rotateY: 90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GameCard card={card} onSelect={handleSelectCard} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GAME */}
        {step === 'game' && currentCard && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md mx-auto"
          >
            <div className={`rounded-2xl bg-gradient-to-br ${cardTypeColors[currentCard.card_type] || 'from-gray-500 to-gray-600'} p-6 mb-6`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded">{currentCard.card_type}</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">{currentCard.difficulty}</span>
              </div>

              <h2 className="text-2xl font-bold mb-3">{currentCard.title}</h2>
              <p className="text-white/90 text-sm leading-relaxed mb-6">{currentCard.description}</p>

              {currentCard.strip_item && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-black/20 mb-4">
                  <Shirt size={16} />
                  <span className="text-xs">Lose: {currentCard.strip_item}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-xs">
                <span>+{currentCard.reward_nexo} NEXO</span>
                <span>+{currentCard.reward_xp} XP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleComplete('win')}
                disabled={loading}
                className="btn-primary py-4 flex items-center justify-center gap-2"
              >
                <Check size={18} /> COMPLETED
              </button>
              <button
                onClick={() => handleComplete('lose')}
                disabled={loading}
                className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
              >
                <X size={18} /> FORFEIT
              </button>
            </div>
          </motion.div>
        )}

        {/* RESULT */}
        {step === 'result' && gameResult && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-nexo-gold to-orange-500 flex items-center justify-center mx-auto mb-4"
            >
              <Trophy size={40} className="text-white" />
            </motion.div>

            {gameResult.leveled_up && (
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="level-up-animation mb-4"
              >
                <span className="text-3xl font-black text-nexo-gold">LEVEL UP!</span>
                <p className="text-lg">Level {gameResult.new_level}</p>
              </motion.div>
            )}

            <div className="glass-panel p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-black text-nexo-gold">+{gameResult.nexo_earned}</div>
                  <div className="text-xs text-gray-400">NEXO COINS</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-nexo-purple">+{gameResult.xp_earned}</div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
              </div>
            </div>

            <button onClick={handleNextCard} className="btn-primary w-full py-3">
              NEXT CARD
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Strip Modal */}
      <Modal isOpen={showStrip} onClose={() => setShowStrip(false)} title="ITEM LOST!" size="sm">
        <div className="text-center py-4">
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            {getStripEmoji(stripItem)}
          </motion.div>
          <h3 className="text-xl font-bold text-nexo-pink mb-2">{stripItem?.toUpperCase()} REMOVED</h3>
          <p className="text-sm text-gray-400">Better luck next time!</p>
          <button onClick={() => setShowStrip(false)} className="btn-primary mt-4 w-full py-2">
            CONTINUE
          </button>
        </div>
      </Modal>
    </div>
  )
}
