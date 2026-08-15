import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Edit2, Save, Shirt, Palette, Settings, BarChart3 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { updateProfile } from '../services/players'

const backgrounds = [
  { id: 'neon-club', name: 'Neon Club', color: 'from-purple-900 to-pink-900' },
  { id: 'dark-lounge', name: 'Dark Lounge', color: 'from-gray-900 to-black' },
  { id: 'cyber-city', name: 'Cyber City', color: 'from-blue-900 to-cyan-900' },
  { id: 'red-velvet', name: 'Red Velvet', color: 'from-red-900 to-rose-900' },
]

const difficulties = [
  { id: 'easy', name: 'Easy', desc: 'Softer challenges' },
  { id: 'medium', name: 'Medium', desc: 'Balanced gameplay' },
  { id: 'hard', name: 'Hard', desc: 'Intense dares' },
  { id: 'extreme', name: 'Extreme', desc: 'No limits' },
]

export default function Profile() {
  const { user, profile, setProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(profile?.username || '')
  const [activeTab, setActiveTab] = useState('profile')

  const handleSave = async () => {
    if (!user) return
    const { data } = await updateProfile(user.id, { username })
    if (data) {
      setProfile(data)
      setEditing(false)
    }
  }

  const handleUpdateSettings = async (updates) => {
    if (!user) return
    const { data } = await updateProfile(user.id, updates)
    if (data) setProfile(data)
  }

  if (!profile) return null

  const clothing = profile.clothing_items || {}

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">PROFILE</h1>

      {/* Profile Header */}
      <div className="glass-panel p-6 mb-6 text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-3xl font-black mx-auto mb-3">
          {profile.username?.[0]?.toUpperCase()}
        </div>

        {editing ? (
          <div className="flex items-center justify-center gap-2 mb-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-center"
            />
            <button onClick={handleSave} className="p-1.5 rounded-lg bg-nexo-success/20 text-nexo-success">
              <Save size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-2">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <button onClick={() => setEditing(true)} className="p-1 rounded-lg hover:bg-white/5">
              <Edit2 size={14} className="text-gray-400" />
            </button>
          </div>
        )}

        <div className="text-sm text-gray-400">Level {profile.level} • {profile.xp} XP</div>

        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="text-center">
            <div className="text-xl font-bold text-nexo-gold">{profile.nexo_coins}</div>
            <div className="text-[10px] text-gray-400">NEXO</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-nexo-purple">{profile.gems}</div>
            <div className="text-[10px] text-gray-400">GEMS</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-nexo-cyan">{profile.energy}</div>
            <div className="text-[10px] text-gray-400">ENERGY</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'clothing', label: 'Clothing', icon: Shirt },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-nexo-pink text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="font-bold text-sm mb-3">Statistics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{profile.level}</div>
                <div className="text-[10px] text-gray-400">Level</div>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <div className="text-lg font-bold">{profile.xp}</div>
                <div className="text-[10px] text-gray-400">Total XP</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'clothing' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="font-bold text-sm mb-3">Current Outfit</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(clothing).map(([item, equipped]) => (
                <div key={item} className={`p-3 rounded-lg border text-center ${
                  equipped ? 'bg-white/5 border-white/10' : 'bg-red-500/10 border-red-500/30'
                }`}>
                  <div className="text-2xl mb-1">
                    {item === 'top' ? '👕' : item === 'bottom' ? '👖' : item === 'shoes' ? '👟' : '💍'}
                  </div>
                  <div className="text-xs font-medium capitalize">{item}</div>
                  <div className={`text-[10px] ${equipped ? 'text-nexo-success' : 'text-nexo-danger'}`}>
                    {equipped ? 'Equipped' : 'Removed'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="font-bold text-sm mb-3">Background Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => handleUpdateSettings({ background_theme: bg.id })}
                  className={`p-3 rounded-xl bg-gradient-to-br ${bg.color} border-2 text-left transition-all ${
                    profile.background_theme === bg.id ? 'border-nexo-pink' : 'border-transparent'
                  }`}
                >
                  <div className="font-medium text-sm">{bg.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel p-4">
            <h3 className="font-bold text-sm mb-3">Difficulty</h3>
            <div className="space-y-2">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => handleUpdateSettings({ difficulty: diff.id })}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    profile.difficulty === diff.id ? 'border-nexo-pink bg-nexo-pink/10' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="font-medium text-sm">{diff.name}</div>
                  <div className="text-[10px] text-gray-400">{diff.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
