import React from 'react'

export default function Modal({ open, onClose, children, width = 460 }) {
  if (!open) return null
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(4,2,10,.72)', backdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center', padding: 18,
      }}
    >
      <div
        className="panel panel-glow"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxWidth: width, padding: 26, animation: 'popReward .35s ease both' }}
      >
        {children}
      </div>
    </div>
  )
}
