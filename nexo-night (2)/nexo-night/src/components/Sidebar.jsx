import React from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/',        icon: '🏠', label: 'Home',    sub: 'Dashboard' },
  { to: '/play',    icon: '🎴', label: 'Play',    sub: 'Start the Game' },
  { to: '/cards',   icon: '🃏', label: 'Cards',   sub: 'Your Collection' },
  { to: '/avatars', icon: '🧑‍🎤', label: 'Avatars', sub: 'Choose Your Style' },
  { to: '/shop',    icon: '🛒', label: 'Shop',    sub: 'Get More Items' },
  { to: '/rewards', icon: '🎁', label: 'Rewards', sub: 'Daily & Challenges' },
  { to: '/ranking', icon: '🏆', label: 'Ranking', sub: 'Top Players' },
  { to: '/profile', icon: '👑', label: 'VIP Club', sub: 'Exclusive Benefits' },
]

export default function Sidebar() {
  return (
    <aside className="app-sidebar col" style={{ padding: '18px 14px', gap: 6 }}>
      {NAV.map((n) => (
        <NavLink key={n.to} to={n.to} end={n.to === '/'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 13px', borderRadius: 'var(--radius-sm)',
            border: '1px solid ' + (isActive ? 'var(--pink)' : 'transparent'),
            background: isActive
              ? 'linear-gradient(100deg, rgba(255,61,139,.18), rgba(123,91,255,.12))'
              : 'transparent',
            boxShadow: isActive ? 'var(--glow-pink)' : 'none',
            transition: 'background .18s, border-color .18s',
          })}
        >
          <span style={{ fontSize: 18 }}>{n.icon}</span>
          <span className="nav-labels col">
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '.04em' }}>{n.label}</strong>
            <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>{n.sub}</span>
          </span>
        </NavLink>
      ))}

      <div className="sidebar-extra panel" style={{ marginTop: 14, padding: 14 }}>
        <div className="row gap-10" style={{ justifyContent: 'space-between' }}>
          <strong style={{ color: 'var(--cyan)', fontFamily: 'var(--font-display)', fontSize: 14 }}>
            Join Community
          </strong>
          <span className="badge" style={{ background: 'rgba(255,180,61,.14)', color: 'var(--gold)', borderColor: 'rgba(255,180,61,.4)' }}>+500 🪙</span>
        </div>
        <div className="row gap-10" style={{ marginTop: 12, fontSize: 18 }}>
          <span>🎮</span><span>✈️</span><span>🐦</span><span>📸</span>
        </div>
      </div>
    </aside>
  )
}
