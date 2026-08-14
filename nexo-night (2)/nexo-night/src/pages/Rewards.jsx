import React, { useEffect, useState, useCallback } from 'react'
import { listRewards, getMyMissions, claimMission } from '../services/rewards'
import { useAuth } from '../hooks/useAuth'
import RewardCard from '../components/RewardCard'
import MissionCard from '../components/MissionCard'

export default function Rewards() {
  const { user, setProfile } = useAuth()
  const [missions, setMissions] = useState([])
  const [rewards, setRewards] = useState([])
  const [note, setNote] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const loadMissions = useCallback(() => {
    if (!user) return
    getMyMissions(user.id).then(setMissions).catch((e) => setNote(e.message))
  }, [user])

  useEffect(() => {
    listRewards().then(setRewards).catch(() => {})
    loadMissions()
  }, [loadMissions])

  async function claim(m) {
    setBusyId(m.id); setNote(null)
    try {
      const updated = await claimMission(m.id)
      setProfile(updated)
      setNote(`Claimed “${m.title}” — +${m.reward_nexo} 🪙 · +${m.reward_xp} XP`)
      loadMissions()
    } catch (e) { setNote(e.message) } finally { setBusyId(null) }
  }

  return (
    <div className="fade-up">
      <div className="eyebrow">Rewards</div>
      <h1 className="title-glow" style={{ fontSize: 34, marginBottom: 16 }}>Daily & Challenges</h1>
      {note && <div className="panel" style={{ padding: 12, borderColor: 'var(--green)', marginBottom: 16 }}>{note}</div>}

      <div className="panel" style={{ padding: 18, marginBottom: 20 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Daily Rewards</strong>
        <div className="row gap-14" style={{ marginTop: 14, overflowX: 'auto' }}>
          {rewards.map((r, i) => (
            <RewardCard key={r.id} day={r.title} value={r.reward_value}
              state={i === 1 ? 'active' : i === 0 ? 'claimed' : 'locked'} />
          ))}
        </div>
      </div>

      <div className="panel" style={{ padding: 18 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Daily Challenges</strong>
        <div style={{ marginTop: 8 }}>
          {missions.map((m) => (
            <MissionCard key={m.id} title={m.title}
              progress={m.progress} target={m.target}
              reward={m.reward_nexo} done={m.completed}
              claimable={m.completed && !m.claimed && busyId !== m.id}
              onClaim={() => claim(m)} />
          ))}
          {!missions.length && <p style={{ color: 'var(--text-mute)' }}>No active challenges.</p>}
        </div>
        <p style={{ color: 'var(--text-mute)', fontSize: 12, marginTop: 12 }}>
          Progress is tracked server-side when you complete cards. Claim pays the DB-defined reward exactly once.
        </p>
      </div>
    </div>
  )
}
