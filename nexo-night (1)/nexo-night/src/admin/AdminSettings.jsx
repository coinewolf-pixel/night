import React, { useState } from 'react'

export default function AdminSettings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [sound, setSound] = useState(localStorage.getItem('sound_enabled') !== 'false')

  function save() {
    localStorage.setItem('theme', theme)
    localStorage.setItem('sound_enabled', String(sound))
    alert('UI settings saved locally.')
  }

  return (
    <div className="panel" style={{ padding: 20, maxWidth: 460 }}>
      <strong style={{ fontFamily: 'var(--font-display)' }}>UI settings</strong>
      <p style={{ color: 'var(--text-mute)', fontSize: 12, margin: '6px 0 16px' }}>
        Only cosmetic client settings live in localStorage — never game economy.
      </p>
      <div className="col gap-14">
        <div className="col gap-6">
          <label className="eyebrow">Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="dark">Dark neon</option>
            <option value="midnight">Midnight</option>
          </select>
        </div>
        <label className="row gap-10">
          <input type="checkbox" checked={sound} onChange={(e) => setSound(e.target.checked)} style={{ width: 18 }} />
          <span>Sound enabled</span>
        </label>
        <button className="btn-primary" onClick={save}>Save settings</button>
      </div>
    </div>
  )
}
