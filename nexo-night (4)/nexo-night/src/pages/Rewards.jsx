import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Clock, Check } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getRewards, getPlayerRewards, claimReward } from '../services/rewards'
import RewardCard from '../components/RewardCard'

const dailyRewards = [
  { day: 1, amount: 100, claimed: true },
  { day: 2, amount: 150, claimed: false, current: true },
  { day: 3, amount: 200, claimed: false },
  { day: 4, amount: 250, claimed: false },
  { day: 5, amount: 500, claimed: false },
  { day: 6, amount: 750, claimed: false },
  { day: 7, amount: 1500, claimed: false },
]

export default function Rewards() {
  const { user, profile } = useAuth()
  const [rewards, setRewards] = useState([])
  const [playerRewards, setPlayerRewards] = useState([])
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    fetchRewards()
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

  const fetchRewards = async () => {
    const [{ data: r }, { data: pr }] = await Promise.all([
      getRewards(),
      user ? getPlayerRewards(user.id) : Promise.resolve({ data: [] })
    ])
    setRewards(r || [])
    setPlayerRewards(pr || [])
  }

  const handleClaim = async (rewardId) => {
    if (!user) return
    await claimReward(user.id, rewardId)
    fetchRewards()
  }

  const isClaimed = (rewardId) => playerRewards.some(pr => pr.reward_id === rewardId)
  const canClaim = (reward) => profile?.level >= reward.required_level

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <Gift size={24} className="text-nexo-gold" />
        REWARDS
      </h1>
      <p className="text-sm text-gray-400 mb-6">Daily rewards and achievements</p>

      {/* Daily Rewards */}
      <div className="glass-panel p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold">Daily Login Rewards</h2>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} />
            {timeLeft}
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
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
              <div className="text-[8px] text-gray-400 mb-1">D{reward.day}</div>
              <div className="text-lg mb-1">{reward.claimed ? '✓' : reward.current ? '🎁' : '📦'}</div>
              <div className="text-[8px] text-nexo-gold">{reward.amount}N</div>
            </div>
          ))}
        </div>
        <button className="w-full btn-primary mt-4 py-2 text-sm">CLAIM DAILY REWARD</button>
      </div>

      {/* Level Rewards */}
      <h2 className="font-bold mb-3">Level Rewards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            claimed={isClaimed(reward.id)}
            canClaim={canClaim(reward) && !isClaimed(reward.id)}
            onClaim={() => handleClaim(reward.id)}
          />
        ))}
      </div>
    </div>
  )
}
