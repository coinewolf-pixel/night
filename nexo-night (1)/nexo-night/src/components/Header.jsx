import React from 'react'
import { useNavigate } from 'react-router-dom'
import CurrencyBar from './CurrencyBar'
import { useAuth } from '../hooks/useAuth'

function IconBtn({ title, onClick, children }) {
  return (
    <button className="btn" title={title} onClick={onClick}
      style={{ width: 46, height: 46, padding: 0, display: 'grid', placeItems: 'center', fontSize: 17 }}>
      {children}
    </button>
  )
}

export default function Header() {
  const nav = useNavigate()
  const { signOut, admin } = useAuth()

  return (
    <header className="app-header row" style={{
      padding: '0 20px', gap: 18, borderBottom: '1px solid var(--glass-border-soft)',
      background: 'rgba(8,4,16,.55)', backdropFilter: 'blur(14px)',
    }}>
      <button className="row gap-10" onClick={() => nav('/')} style={{ background: 'none' }}>
        <span style={{
          width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center',
          background: 'linear-gradient(135deg, var(--pink), var(--violet))',
          fontFamily: 'var(--font-display)', fontWeight: 900, color: '#fff', boxShadow: 'var(--glow-pink)',
        }}>N</span>
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '.14em' }}>NEXO</strong>
      </button>

      <div className="grow row center"><CurrencyBar /></div>

      <div className="row gap-10">
        {admin && (
          <button className="btn" onClick={() => nav('/admin')}
            style={{ height: 46, fontSize: 12 }}>Admin</button>
        )}
        <IconBtn title="Rewards" onClick={() => nav('/rewards')}>🎁</IconBtn>
        <IconBtn title="Messages" onClick={() => nav('/rewards')}>✉️</IconBtn>
        <IconBtn title="Profile" onClick={() => nav('/profile')}>⚙️</IconBtn>
        <IconBtn title="Sign out" onClick={() => signOut()}>⎋</IconBtn>
      </div>
    </header>
  )
}
