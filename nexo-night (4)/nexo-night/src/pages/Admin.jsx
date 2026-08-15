import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Users, Layers, CreditCard, Image, Settings, Shield } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AdminDashboard from '../admin/AdminDashboard'
import AdminModules from '../admin/AdminModules'
import AdminCards from '../admin/AdminCards'
import AdminImages from '../admin/AdminImages'
import AdminPlayers from '../admin/AdminPlayers'
import AdminSettings from '../admin/AdminSettings'

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'players', label: 'Players', icon: Users },
  { id: 'modules', label: 'Modules', icon: Layers },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'images', label: 'Images', icon: Image },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Admin() {
  const { user, admin, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) return null
  if (!user || !admin) return <Navigate to="/" replace />

  return (
    <div className="mobile-content pt-20 px-4 pb-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={24} className="text-nexo-pink" />
        <h1 className="text-2xl font-bold">ADMIN PANEL</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id ? 'bg-nexo-pink text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'players' && <AdminPlayers />}
        {activeTab === 'modules' && <AdminModules />}
        {activeTab === 'cards' && <AdminCards />}
        {activeTab === 'images' && <AdminImages />}
        {activeTab === 'settings' && <AdminSettings />}
      </motion.div>
    </div>
  )
}
