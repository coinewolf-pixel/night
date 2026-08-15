import { Link, useLocation } from 'react-router-dom'
import { Home, Play, CreditCard, UserCircle, ShoppingCart, Gift, Trophy, Crown, Send } from 'lucide-react'

const navItems = [
  { path: '/', icon: Home, label: 'HOME', sub: 'Main Hub' },
  { path: '/play', icon: Play, label: 'PLAY', sub: 'Start the Game' },
  { path: '/cards', icon: CreditCard, label: 'CARDS', sub: 'Your Collection' },
  { path: '/avatars', icon: UserCircle, label: 'AVATARS', sub: 'Choose Style' },
  { path: '/shop', icon: ShoppingCart, label: 'SHOP', sub: 'Get More Items' },
  { path: '/rewards', icon: Gift, label: 'REWARDS', sub: 'Daily & Challenges' },
  { path: '/ranking', icon: Trophy, label: 'RANKING', sub: 'Top Players' },
  { path: '/vip', icon: Crown, label: 'VIP CLUB', sub: 'Exclusive Benefits' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop fixed left-0 top-20 bottom-0 w-56 z-30 p-4 overflow-y-auto">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-nexo-pink/20 to-nexo-purple/20 border border-nexo-pink/30 neon-border' 
                    : 'hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-nexo-pink' : 'text-gray-400'} />
                <div>
                  <div className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] text-gray-500">{item.sub}</div>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="mt-6 glass-panel p-4">
          <div className="flex items-center gap-2 mb-2">
            <Send size={14} className="text-nexo-cyan" />
            <span className="text-xs font-semibold">JOIN COMMUNITY</span>
          </div>
          <div className="text-xs text-gray-400 mb-3">+500 NEXO</div>
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded bg-blue-600/30 flex items-center justify-center text-[10px]">FB</div>
            <div className="w-7 h-7 rounded bg-sky-500/30 flex items-center justify-center text-[10px]">TW</div>
            <div className="w-7 h-7 rounded bg-pink-600/30 flex items-center justify-center text-[10px]">IG</div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav flex justify-around items-center py-2 px-4 safe-bottom">
        {navItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg ${
                isActive ? 'text-nexo-pink' : 'text-gray-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
