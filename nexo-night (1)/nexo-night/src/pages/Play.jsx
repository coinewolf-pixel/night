import React, { useEffect, useState } from 'react'
import { useGame } from '../hooks/useGame'
import { usePlayer } from '../hooks/usePlayer'
import GameCard from '../components/GameCard'
import Modal from '../components/Modal'

export default function Play() {
  const { modules, cards, loading, error, loadModules, loadCards, finishCard } = useGame()
  const { level } = usePlayer()

  const [step, setStep] = useState('module') // module | card | reward
  const [activeModule, setActiveModule] = useState(null)
  const [activeCard, setActiveCard] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const [reward, setReward] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { loadModules() }, [loadModules])

  function pickModule(m) {
    setActiveModule(m); setStep('card'); setFlipped(false); setActiveCard(null)
    loadCards(m.id)
  }

  function pickCard(c) { setActiveCard(c); setFlipped(true) }

  async function complete(result) {
    if (!activeCard || busy) return
    setBusy(true)
    try {
      const r = await finishCard(activeCard, result)
      setReward(r); setStep('reward')
    } catch (e) {
      alert('Could not save result: ' + e.message)
    } finally { setBusy(false) }
  }

  function reset() {
    setStep('module'); setActiveModule(null); setActiveCard(null)
    setFlipped(false); setReward(null)
  }

  return (
    <div className="fade-up">
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div className="eyebrow">Play</div>
          <h1 className="title-glow" style={{ fontSize: 34 }}>Choose your game</h1>
        </div>
        {step !== 'module' && (
          <button className="btn" onClick={reset}>← Back to modes</button>
        )}
      </div>

      {error && <div className="panel" style={{ padding: 14, borderColor: 'var(--pink)', marginBottom: 14 }}>{error}</div>}

      {step === 'module' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
          {loading && <p style={{ color: 'var(--text-mute)' }}>Loading modules…</p>}
          {modules.map((m) => {
            const locked = level < m.min_level
            return (
              <button key={m.id} className="panel" disabled={locked}
                onClick={() => pickModule(m)}
                style={{ textAlign: 'left', padding: 0, overflow: 'hidden', opacity: locked ? 0.55 : 1,
                  cursor: locked ? 'not-allowed' : 'pointer' }}>
                <img src={m.image_url || '/assets/module-default.svg'} alt=""
                  style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                <div style={{ padding: 18 }}>
                <div className="row" style={{ justifyContent: 'space-between' }}>
                  <strong style={{ fontFamily: 'var(--font-display)', fontSize: 17 }}>{m.title}</strong>
                  {locked && <span className="badge">Lvl {m.min_level}</span>}
                </div>
                <p style={{ color: 'var(--text-dim)', fontSize: 13, margin: '8px 0 12px', lineHeight: 1.5 }}>
                  {m.description}
                </p>
                <span className="badge" style={{ background: 'rgba(255,180,61,.14)', color: 'var(--gold)', borderColor: 'rgba(255,180,61,.4)' }}>
                  up to +{m.reward_nexo} 🪙
                </span>
                </div>
              </button>
            )
          })}
          {!loading && !modules.length && (
            <p style={{ color: 'var(--text-mute)' }}>No modules yet. Add some in the Admin panel.</p>
          )}
        </div>
      )}

      {step === 'card' && (
        <div>
          <p style={{ color: 'var(--text-dim)', marginBottom: 16 }}>
            Module: <strong>{activeModule?.title}</strong> — tap a card to reveal the challenge.
          </p>
          {loading && <p style={{ color: 'var(--text-mute)' }}>Dealing cards…</p>}
          <div className="row gap-20" style={{ flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {!activeCard && cards.map((c) => (
              <GameCard key={c.id} card={c} flipped={false} onClick={() => pickCard(c)} />
            ))}
            {activeCard && (
              <div className="col gap-20" style={{ alignItems: 'center', width: '100%' }}>
                <GameCard card={activeCard} flipped onClick={() => {}} />
                <div className="row gap-14">
                  <button className="btn" disabled={busy} onClick={() => complete('skipped')}>Skip</button>
                  <button className="btn-primary" disabled={busy} onClick={() => complete('completed')}
                    style={{ padding: '12px 30px' }}>
                    {busy ? 'Saving…' : 'COMPLETE'}
                  </button>
                </div>
              </div>
            )}
            {!loading && !cards.length && (
              <p style={{ color: 'var(--text-mute)' }}>No cards in this module yet.</p>
            )}
          </div>
        </div>
      )}

      <Modal open={step === 'reward'} onClose={reset} width={380}>
        <div className="col center" style={{ gap: 10, textAlign: 'center' }}>
          <div style={{ fontSize: 54, animation: 'popReward .5s ease both' }}>🎉</div>
          <h2 className="title-glow" style={{ fontSize: 28 }}>Challenge complete!</h2>
          <div className="row gap-20" style={{ marginTop: 6 }}>
            <div className="col center">
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)' }}>
                +{activeCard?.reward_nexo ?? 0}
              </strong>
              <span className="eyebrow">Nexo</span>
            </div>
            <div className="col center">
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--cyan)' }}>
                +{activeCard?.reward_xp ?? 0}
              </strong>
              <span className="eyebrow">XP</span>
            </div>
          </div>
          {reward && (
            <p style={{ color: 'var(--text-dim)', marginTop: 8 }}>
              Level {reward.level} · {reward.nexo_coins?.toLocaleString()} 🪙 total
            </p>
          )}
          <button className="btn-primary btn-block" onClick={reset} style={{ marginTop: 12 }}>Keep playing</button>
        </div>
      </Modal>
    </div>
  )
}
