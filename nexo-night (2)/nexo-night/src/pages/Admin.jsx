import React from 'react'
import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import AdminDashboard from '../admin/AdminDashboard'
import AdminModules from '../admin/AdminModules'
import AdminCards from '../admin/AdminCards'
import AdminImages from '../admin/AdminImages'
import AdminPlayers from '../admin/AdminPlayers'
import AdminSettings from '../admin/AdminSettings'

const TABS = [
  { to: '', label: 'Dashboard' },
  { to: 'players', label: 'Players' },
  { to: 'modules', label: 'Modules' },
  { to: 'cards', label: 'Cards' },
  { to: 'images', label: 'Images' },
  { to: 'settings', label: 'Settings' },
]

export default function Admin() {
  const nav = useNavigate()
  const { profile } = useAuth()

  return (
    <div style={{ minHeight: '100vh', padding: '18px 24px 40px' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
        <div className="row gap-14">
          <span style={{ width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center',
            background: 'linear-gradient(135deg, var(--pink), var(--violet))', fontFamily: 'var(--font-display)',
            fontWeight: 900, color: '#fff' }}>N</span>
          <div>
            <div className="eyebrow">Admin</div>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>NEXO Control Panel</strong>
          </div>
        </div>
        <div className="row gap-10">
          <span style={{ color: 'var(--text-mute)', fontSize: 13 }}>{profile?.username}</span>
          <button className="btn" onClick={() => nav('/')}>← Back to game</button>
        </div>
      </div>

      <div className="row gap-10" style={{ flexWrap: 'wrap', marginBottom: 20 }}>
        {TABS.map((t) => (
          <NavLink key={t.to} to={t.to} end={t.to === ''}
            className="btn"
            style={({ isActive }) => ({
              borderColor: isActive ? 'var(--pink)' : undefined,
              boxShadow: isActive ? 'var(--glow-pink)' : undefined,
            })}>
            {t.label}
          </NavLink>
        ))}
      </div>

      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="players" element={<AdminPlayers />} />
        <Route path="modules" element={<AdminModules />} />
        <Route path="cards" element={<AdminCards />} />
        <Route path="images" element={<AdminImages />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  )
}
