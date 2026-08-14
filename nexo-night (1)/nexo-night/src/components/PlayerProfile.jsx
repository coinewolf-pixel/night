import React from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlayer } from '../hooks/usePlayer'

export default function PlayerProfile() {
  const nav = useNavigate()
  const { profile, level, xpInLevel, xpPct } = usePlayer()
  const name = profile?.username ?? 'Player'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="panel" style={{ padding: 16 }}>
      <div className="row gap-14">
        <div style={{
          width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
          background: profile?.avatar_url ? `center/cover url(${profile.avatar_url})`
            : 'linear-gradient(135deg, var(--pink), var(--violet))',
          display: 'grid', placeItems: 'center', fontFamily: 'var(--font-display)',
          fontWeight: 900, fontSize: 22, color: '#fff', border: '2px solid var(--pink)',
          boxShadow: 'var(--glow-pink)',
        }}>{!profile?.avatar_url && initial}</div>

        <div className="grow col gap-6">
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17, letterSpacing: '.05em' }}>
              {name.toUpperCase()}
            </strong>
            <button className="btn btn-ghost" onClick={() => nav('/profile')}
              style={{ padding: '4px 8px', fontSize: 12 }}>✎</button>
          </div>
          <span className="eyebrow" style={{ color: 'var(--magenta)' }}>Level {level}</span>
        </div>
      </div>

      <div className="col gap-6" style={{ marginTop: 12 }}>
        <div className="bar"><span style={{ width: `${xpPct}%` }} /></div>
        <span style={{ fontSize: 12, color: 'var(--text-mute)', alignSelf: 'flex-end' }}>
          {xpInLevel.toLocaleString()} / 1,000 XP
        </span>
      </div>
    </div>
  )
}
