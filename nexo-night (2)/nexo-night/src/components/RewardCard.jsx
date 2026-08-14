import React from 'react'

export default function RewardCard({ day, value, state = 'locked', onClaim }) {
  const active = state === 'active'
  const claimed = state === 'claimed'
  return (
    <div className="panel" style={{
      padding: 14, textAlign: 'center', minWidth: 92,
      borderColor: active ? 'var(--pink)' : 'var(--glass-border-soft)',
      boxShadow: active ? 'var(--glow-pink)' : 'none',
      opacity: claimed ? 0.55 : 1,
    }}>
      <div className="eyebrow" style={{ color: active ? 'var(--magenta)' : 'var(--text-mute)' }}>{day}</div>
      <div style={{ fontSize: 30, margin: '8px 0' }}>{claimed ? '✅' : '🎁'}</div>
      <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>{value} 🪙</strong>
      {active && onClaim && (
        <button className="btn-primary" onClick={onClaim}
          style={{ marginTop: 10, padding: '6px 10px', fontSize: 11, width: '100%' }}>Claim</button>
      )}
    </div>
  )
}
