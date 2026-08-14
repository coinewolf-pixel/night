import React from 'react'

export default function PlayButton({ onClick, label = 'PLAY NOW' }) {
  return (
    <button onClick={onClick} className="btn-primary"
      style={{
        fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 30,
        letterSpacing: '.12em', padding: '18px 46px', borderRadius: 16,
        clipPath: 'polygon(4% 0, 96% 0, 100% 50%, 96% 100%, 4% 100%, 0 50%)',
        animation: 'pulseGlow 2.4s ease-in-out infinite',
      }}>
      {label}
    </button>
  )
}
