import React from 'react'

const ITEMS = [
  { name: 'Starter Pack', price: '500 🪙', perk: '+3 hints, +5 energy' },
  { name: 'Hot Bundle', price: '1,200 🪙', perk: 'Unlock hot challenges' },
  { name: 'Gem Chest', price: '850 💎', perk: '10 exclusive cards' },
  { name: 'VIP Month', price: '2,000 🪙', perk: 'Double rewards, no ads' },
]

export default function Shop() {
  return (
    <div className="fade-up">
      <div className="eyebrow">Shop</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 16 }}>Get More Items</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {ITEMS.map((it) => (
          <div key={it.name} className="panel" style={{ padding: 18 }}>
            <strong style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>{it.name}</strong>
            <p style={{ color: 'var(--text-dim)', fontSize: 13, margin: '8px 0 14px' }}>{it.perk}</p>
            <button className="btn-primary btn-block">{it.price}</button>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-mute)', marginTop: 16, fontSize: 13 }}>
        Purchases are a demo placeholder — wire them to a payment provider or a secure RPC before going live.
      </p>
    </div>
  )
}
