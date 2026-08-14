import React from 'react'

const TAGS = { NEW: 'badge-new', SOON: 'badge-soon' }

export default function GameModeCard({ icon, title, subtitle, tag, meta, disabled, onClick }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className="panel"
      style={{
        position: 'relative', textAlign: 'left', padding: 16, width: '100%',
        opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform .14s, box-shadow .2s, border-color .2s',
      }}
      onMouseEnter={(e) => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = 'var(--glow-pink)'; e.currentTarget.style.borderColor = 'var(--pink)' } }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '' }}
    >
      {tag && <span className={`badge ${TAGS[tag] || ''}`} style={{ position: 'absolute', top: 10, right: 10 }}>{tag}</span>}
      <div className="row gap-14">
        <span style={{
          width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center',
          fontSize: 22, background: 'rgba(255,61,139,.12)', border: '1px solid var(--glass-border)',
        }}>{icon}</span>
        <div className="col gap-6">
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: '.04em' }}>{title}</strong>
          <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>{subtitle}</span>
        </div>
      </div>
      {meta && <div style={{ marginTop: 10, fontSize: 12, color: 'var(--cyan)' }}>{meta}</div>}
    </button>
  )
}
