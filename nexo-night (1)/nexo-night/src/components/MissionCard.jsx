import React from 'react'

export default function MissionCard({ title, progress = 0, target = 1, reward, done, onClaim, claimable }) {
  const pct = Math.min(100, Math.round((progress / target) * 100))
  return (
    <div className="col gap-6" style={{ padding: '10px 0', borderBottom: '1px solid var(--glass-border-soft)' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14 }}>{title}</span>
        <div className="row gap-10">
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{progress}/{target}</span>
          {done ? <span style={{ color: 'var(--green)' }}>✔</span>
                : <span style={{ color: 'var(--gold)', fontSize: 13 }}>{reward} 🪙</span>}
        </div>
      </div>
      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
      {claimable && (
        <button className="btn-primary" onClick={onClaim}
          style={{ marginTop: 8, alignSelf: 'flex-start', padding: '5px 14px', fontSize: 11 }}>Claim reward</button>
      )}
    </div>
  )
}
