import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Lock, User } from 'lucide-react'
import { supabase } from '../services/supabase'
import { updateProfile } from '../services/players'
import { useAuth } from '../hooks/useAuth'

export default function Avatars() {
  const { user, profile, setProfile } = useAuth()
  const [characters, setCharacters] = useState([])
  const [selectedChar, setSelectedChar] = useState(null)

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    const { data } = await supabase.from('characters').select('*').eq('is_active', true)
    setCharacters(data || [])
  }

  const handleSelect = async (char) => {
    if (!user) return
    setSelectedChar(char)
    const { data } = await updateProfile(user.id, { preferred_character: char.id })
    if (data) setProfile(data)
  }

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">CHOOSE YOUR CHARACTER</h1>
      <p className="text-sm text-gray-400 mb-6">Select who you want to play as</p>

      {profile && (
        <div className="glass-panel p-4 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-2xl">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={28} />
            )}
          </div>
          <div>
            <div className="font-bold">{profile.username}</div>
            <div className="text-xs text-gray-400">Level {profile.level}</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {characters.map((char, i) => {
          const isSelected = profile?.preferred_character === char.id
          return (
            <motion.button
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleSelect(char)}
              className={`glass-panel p-4 text-center transition-all ${
                isSelected ? 'neon-border border-nexo-pink/50' : 'hover:bg-white/5'
              }`}
            >
              <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-nexo-purple/30 to-nexo-pink/30">
                {char.image_url ? (
                  <img src={char.image_url} alt={char.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {char.gender === 'female' ? '👩' : char.gender === 'male' ? '👨' : '👤'}
                  </div>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-nexo-pink/20 flex items-center justify-center">
                    <Check size={24} className="text-nexo-pink" />
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm">{char.name}</h3>
              <p className="text-[10px] text-gray-400 mt-1">{char.age} years • {char.gender}</p>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{char.description}</p>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
