import React from 'react'

export default function LoadingScreen({ label = 'Loading NEXO NIGHT' }) {
  return (
    <div className="row center col" style={{ minHeight: '100vh', gap: 22 }}>
      <div style={{
        width: 74, height: 74, borderRadius: '50%',
        border: '3px solid rgba(255,61,139,.2)', borderTopColor: 'var(--pink)',
        boxShadow: 'var(--glow-pink)', animation: 'spin 1s linear infinite',
      }} />
      <div className="eyebrow" style={{ letterSpacing: '.35em' }}>{label}</div>
    </div>
  )
}
