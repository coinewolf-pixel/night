import React, { useEffect, useState } from 'react'
import { getLeaderboard } from '../services/players'
import { useAuth } from '../hooks/useAuth'

export default function Ranking() {
  const { user } = useAuth()
  const [rows, setRows] = useState([])
  useEffect(() => { getLeaderboard(50).then(setRows).catch(() => {}) }, [])

  return (
    <div className="fade-up">
      <div className="eyebrow">Ranking</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 16 }}>Top Players</h1>
      <div className="panel" style={{ padding: 8 }}>
        {rows.map((p, i) => (
          <div key={p.id} className="row" style={{
            justifyContent: 'space-between', padding: '12px 14px',
            borderBottom: '1px solid var(--glass-border-soft)',
            background: p.id === user?.id ? 'rgba(255,61,139,.08)' : 'transparent', borderRadius: 8,
          }}>
            <div className="row gap-14">
              <span style={{ width: 28, textAlign: 'center', fontFamily: 'var(--font-display)',
                color: i < 3 ? 'var(--gold)' : 'var(--text-mute)', fontWeight: 900 }}>#{i + 1}</span>
              <strong>{p.username}</strong>
              <span className="eyebrow" style={{ color: 'var(--magenta)' }}>Lv {p.level}</span>
            </div>
            <div className="row gap-20">
              <span style={{ color: 'var(--cyan)' }}>{p.xp?.toLocaleString()} XP</span>
              <span style={{ color: 'var(--gold)' }}>{p.nexo_coins?.toLocaleString()} 🪙</span>
            </div>
          </div>
        ))}
        {!rows.length && <p style={{ color: 'var(--text-mute)', padding: 14 }}>No players yet.</p>}
      </div>
    </div>
  )
}
