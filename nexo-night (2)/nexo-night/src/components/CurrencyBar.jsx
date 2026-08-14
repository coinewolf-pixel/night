import React from 'react'
import { usePlayer } from '../hooks/usePlayer'

function Chip({ icon, color, label, value }) {
  return (
    <div className="row gap-10" style={{ padding: '4px 4px' }}>
      <span style={{
        width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center',
        background: `${color}22`, border: `1px solid ${color}66`, boxShadow: `0 0 14px ${color}55`,
        fontSize: 15,
      }}>{icon}</span>
      <div className="col">
        <span className="cur-label eyebrow" style={{ fontSize: 9 }}>{label}</span>
        <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16, lineHeight: 1 }}>{value}</strong>
      </div>
    </div>
  )
}

export default function CurrencyBar() {
  const { coins, gems, energy, energyMax } = usePlayer()
  return (
    <div className="currency-bar row gap-20 panel" style={{ padding: '8px 16px' }}>
      <Chip icon="🪙" color="#ffb43d" label="Nexo Coins" value={coins.toLocaleString()} />
      <span style={{ width: 1, height: 26, background: 'var(--glass-border-soft)' }} />
      <Chip icon="💎" color="#3fd0ff" label="Gems" value={gems.toLocaleString()} />
      <span style={{ width: 1, height: 26, background: 'var(--glass-border-soft)' }} />
      <Chip icon="⚡" color="#7b5bff" label="Energy" value={`${energy}/${energyMax}`} />
    </div>
  )
}
