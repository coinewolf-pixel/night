import React, { useState } from 'react'
import { usePlayer } from '../hooks/usePlayer'
import { updateProfileCosmetic } from '../services/players'
import { useAuth } from '../hooks/useAuth'

const PRESETS = ['🦊','🐱','🐼','🦁','🐯','🐺','🦄','🐉','👽','🤖','😈','👑']

export default function Avatars() {
  const { user, refreshProfile } = useAuth()
  const { profile } = usePlayer()
  const [busy, setBusy] = useState(false)

  async function choose(emoji) {
    setBusy(true)
    try {
      // Store emoji as a data URL avatar for a self-contained demo.
      const url = `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='%23120a22'/><text x='60' y='82' font-size='70' text-anchor='middle'>${emoji}</text></svg>`
      )}`
      await updateProfileCosmetic(user.id, { avatar_url: url })
      await refreshProfile()
    } finally { setBusy(false) }
  }

  return (
    <div className="fade-up">
      <div className="eyebrow">Avatars</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 8 }}>Choose Your Style</h1>
      <p style={{ color: 'var(--text-dim)', marginBottom: 20 }}>Current: {profile?.username}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(90px,1fr))', gap: 14 }}>
        {PRESETS.map((e) => (
          <button key={e} className="panel" disabled={busy} onClick={() => choose(e)}
            style={{ aspectRatio: '1', fontSize: 40, display: 'grid', placeItems: 'center' }}>{e}</button>
        ))}
      </div>
    </div>
  )
}
