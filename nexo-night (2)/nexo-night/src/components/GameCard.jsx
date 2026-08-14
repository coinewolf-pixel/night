import React from 'react'

// Flippable truth/dare style card used in the Play flow and Cards page.
export default function GameCard({ card, flipped = false, onClick, compact = false }) {
  const isDare = (card?.card_type || 'dare') === 'dare'
  const accent = isDare ? 'var(--pink)' : 'var(--cyan)'
  const glow = isDare ? '0 0 26px rgba(255,61,139,.55)' : '0 0 26px rgba(63,208,255,.5)'

  return (
    <button
      onClick={onClick}
      className="panel"
      style={{
        width: compact ? 150 : 200, minHeight: compact ? 200 : 270,
        padding: 18, borderColor: accent, boxShadow: glow,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 14, textAlign: 'center', animation: 'flipIn .5s ease both',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, letterSpacing: '.1em',
        fontSize: compact ? 18 : 22, color: accent, textShadow: glow,
      }}>
        {isDare ? '🔥 DARE' : '💬 TRUTH'}
      </span>
      {flipped ? (
        <div className="col gap-6">
          <strong style={{ fontSize: 15 }}>{card.title}</strong>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.5 }}>{card.description}</p>
          <span className="badge" style={{ marginTop: 8, alignSelf: 'center' }}>
            +{card.reward_nexo} 🪙 · +{card.reward_xp} XP
          </span>
        </div>
      ) : (
        <span style={{ fontSize: 44 }}>{isDare ? '❤️‍🔥' : '❓'}</span>
      )}
    </button>
  )
}
