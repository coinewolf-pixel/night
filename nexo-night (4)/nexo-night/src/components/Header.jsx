import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Gift, Mail, Settings, LogOut, User, Menu, X, Crown } from 'lucide-react'
import { signOut } from '../services/auth'

export default function Header({ user, profile, admin }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 safe-top">
      <div className="glass-panel-strong mx-2 mt-2 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center font-bold text-sm">
            N
          </div>
          <span className="font-bold text-lg hidden sm:block">NEXO</span>
        </Link>

        {profile && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-nexo-gold">N</span>
              <span className="font-semibold">{profile.nexo_coins?.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Crown size={12} className="text-nexo-purple" />
              <span className="font-semibold">{profile.gems}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-nexo-cyan">⚡</span>
              <span className="font-semibold">{profile.energy}/{profile.energy_max}</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Gift size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Mail size={18} />
          </button>
          <button className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <Settings size={18} />
          </button>

          {user ? (
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center text-xs font-bold"
              >
                {profile?.username?.[0]?.toUpperCase() || 'U'}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-10 w-48 glass-panel-strong py-2 z-50">
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-white/5" onClick={() => setMenuOpen(false)}>
                    <User size={16} /> Profile
                  </Link>
                  {admin && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 text-nexo-pink" onClick={() => setMenuOpen(false)}>
                      <Crown size={16} /> Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 hover:bg-white/5 w-full text-left text-nexo-danger">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-xs py-2 px-3">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}
