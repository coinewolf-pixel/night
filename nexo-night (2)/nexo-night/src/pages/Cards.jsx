import React, { useEffect, useState } from 'react'
import { listModules } from '../services/modules'
import { listCards } from '../services/cards'
import GameCard from '../components/GameCard'

export default function Cards() {
  const [modules, setModules] = useState([])
  const [cards, setCards] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    listModules().then((ms) => {
      setModules(ms)
      if (ms[0]) { setActive(ms[0].id); listCards(ms[0].id).then(setCards) }
    }).catch(() => {})
  }, [])

  function pick(id) { setActive(id); listCards(id).then(setCards).catch(() => {}) }

  return (
    <div className="fade-up">
      <div className="eyebrow">Cards</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 16 }}>Your Collection</h1>
      <div className="row gap-10" style={{ flexWrap: 'wrap', marginBottom: 20 }}>
        {modules.map((m) => (
          <button key={m.id} className="btn" onClick={() => pick(m.id)}
            style={{ borderColor: active === m.id ? 'var(--pink)' : undefined,
              boxShadow: active === m.id ? 'var(--glow-pink)' : undefined }}>
            {m.title}
          </button>
        ))}
      </div>
      <div className="row gap-20" style={{ flexWrap: 'wrap' }}>
        {cards.map((c) => <GameCard key={c.id} card={c} flipped compact onClick={() => {}} />)}
        {!cards.length && <p style={{ color: 'var(--text-mute)' }}>No cards to show.</p>}
      </div>
    </div>
  )
}
