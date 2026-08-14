import React, { useEffect, useState } from 'react'
import { usePlayer } from '../hooks/usePlayer'
import { useAuth } from '../hooks/useAuth'
import { updateProfileCosmetic } from '../services/players'
import { getMyResults } from '../services/games'

export default function Profile() {
  const { user, refreshProfile, signOut } = useAuth()
  const { profile, level, coins, gems, xp, xpPct, xpInLevel } = usePlayer()
  const [username, setUsername] = useState('')
  const [results, setResults] = useState([])
  const [note, setNote] = useState(null)

  useEffect(() => { if (profile) setUsername(profile.username) }, [profile])
  useEffect(() => { if (user) getMyResults(user.id, 10).then(setResults).catch(() => {}) }, [user])

  async function save() {
    try {
      await updateProfileCosmetic(user.id, { username })
      await refreshProfile()
      setNote('Saved.')
    } catch (e) { setNote(e.message) }
  }

  return (
    <div className="fade-up" style={{ maxWidth: 720 }}>
      <div className="eyebrow">Profile</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 16 }}>{profile?.username}</h1>

      <div className="panel" style={{ padding: 18, marginBottom: 18 }}>
        <div className="row gap-20" style={{ flexWrap: 'wrap' }}>
          <Stat label="Level" value={level} color="var(--magenta)" />
          <Stat label="XP" value={xp?.toLocaleString()} color="var(--cyan)" />
          <Stat label="Nexo" value={coins?.toLocaleString()} color="var(--gold)" />
          <Stat label="Gems" value={gems?.toLocaleString()} color="var(--cyan)" />
        </div>
        <div className="bar" style={{ marginTop: 16 }}><span style={{ width: `${xpPct}%` }} /></div>
        <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>{xpInLevel} / 1,000 XP to next level</span>
      </div>

      {note && <div className="panel" style={{ padding: 12, marginBottom: 14, borderColor: 'var(--green)' }}>{note}</div>}

      <div className="panel" style={{ padding: 18, marginBottom: 18 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Edit profile</strong>
        <div className="col gap-6" style={{ marginTop: 12 }}>
          <label className="eyebrow">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <button className="btn-primary" onClick={save} style={{ marginTop: 12 }}>Save changes</button>
      </div>

      <div className="panel" style={{ padding: 18, marginBottom: 18 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Recent results</strong>
        <div style={{ marginTop: 10 }}>
          {results.map((r) => (
            <div key={r.id} className="row" style={{ justifyContent: 'space-between', padding: '8px 0',
              borderBottom: '1px solid var(--glass-border-soft)', fontSize: 14 }}>
              <span style={{ color: r.result === 'completed' ? 'var(--green)' : 'var(--text-mute)' }}>{r.result}</span>
              <span style={{ color: 'var(--gold)' }}>+{r.nexo_earned} 🪙 · +{r.xp_earned} XP</span>
            </div>
          ))}
          {!results.length && <p style={{ color: 'var(--text-mute)', marginTop: 8 }}>No games played yet.</p>}
        </div>
      </div>

      <button className="btn" onClick={signOut}>Sign out</button>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div className="col center" style={{ minWidth: 90 }}>
      <strong style={{ fontFamily: 'var(--font-display)', fontSize: 26, color }}>{value}</strong>
      <span className="eyebrow">{label}</span>
    </div>
  )
}
