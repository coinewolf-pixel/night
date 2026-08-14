import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PlayerProfile from '../components/PlayerProfile'
import PlayButton from '../components/PlayButton'
import GameModeCard from '../components/GameModeCard'
import RewardCard from '../components/RewardCard'
import MissionCard from '../components/MissionCard'
import { listRewards, getMyMissions } from '../services/rewards'
import { useAuth } from '../hooks/useAuth'

const MODES = [
  { icon: '💗', title: 'QUICK MATCH', subtitle: 'Find random partner', meta: 'Online: 1,245', to: '/play' },
  { icon: '🔒', title: 'PRIVATE ROOM', subtitle: 'Play with friends', to: '/play' },
  { icon: '📖', title: 'STORY MODE', subtitle: 'Levels & adventures', tag: 'NEW', to: '/play' },
  { icon: '🔥', title: 'HOT CHALLENGES', subtitle: 'Dares & more', tag: 'NEW', to: '/play' },
  { icon: '👫', title: 'COUPLE MODE', subtitle: 'For couples', tag: 'SOON', disabled: true },
]

export default function Home() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [rewards, setRewards] = useState([])
  const [missions, setMissions] = useState([])

  useEffect(() => {
    listRewards().then(setRewards).catch(() => {})
    if (user) getMyMissions(user.id).then(setMissions).catch(() => {})
  }, [user])

  return (
    <div className="fade-up">
      <div className="home-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* HERO */}
        <section className="home-hero panel panel-glow" style={{
          position: 'relative', overflow: 'hidden', minHeight: 520, padding: 34,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background:
            'radial-gradient(600px 400px at 50% 30%, rgba(123,91,255,.28), transparent 60%),' +
            'linear-gradient(180deg, rgba(30,12,48,.55), rgba(12,6,22,.85)),' +
            'center/cover url(/assets/hero-bg.svg)',
        }}>
          <div className="col center" style={{ gap: 4 }}>
            <h1 className="hero-title title-glow float" style={{ fontSize: 92, lineHeight: .9 }}>NEXO</h1>
            <div className="row gap-10" style={{ marginTop: -6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, fontStyle: 'italic',
                color: 'var(--pink)', textShadow: 'var(--glow-pink)' }}>NIGHT</span>
              <span className="badge" style={{ alignSelf: 'center' }}>21+</span>
            </div>
            <div className="eyebrow" style={{ marginTop: 10, letterSpacing: '.28em', color: 'var(--text-dim)' }}>
              ❤ Flirt. Play. Dare. Win. ❤
            </div>
          </div>

          <div className="row gap-20" style={{ margin: '30px 0 6px' }}>
            <div className="panel" style={{ width: 120, height: 150, display: 'grid', placeItems: 'center',
              borderColor: 'var(--pink)', boxShadow: '0 0 26px rgba(255,61,139,.5)' }}>
              <div className="col center gap-6">
                <span style={{ fontSize: 34 }}>❤️‍🔥</span>
                <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--pink)', letterSpacing: '.12em' }}>DARE</strong>
              </div>
            </div>
            <div className="panel" style={{ width: 120, height: 150, display: 'grid', placeItems: 'center',
              borderColor: 'var(--cyan)', boxShadow: '0 0 26px rgba(63,208,255,.45)' }}>
              <div className="col center gap-6">
                <span style={{ fontSize: 34 }}>💬</span>
                <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--cyan)', letterSpacing: '.12em' }}>TRUTH</strong>
              </div>
            </div>
          </div>

          <p style={{ color: 'var(--text-dim)', letterSpacing: '.14em', fontSize: 13, margin: '4px 0 18px' }}>
            CHOOSE A CARD. ACCEPT THE CHALLENGE.
          </p>
          <PlayButton onClick={() => nav('/play')} />
          <p style={{ color: 'var(--text-mute)', marginTop: 14, fontSize: 13 }}>Find your partner. Start the fun.</p>

          <div style={{ position: 'absolute', left: 20, bottom: 18, maxWidth: 150 }}>
            <div className="badge" style={{ marginBottom: 6 }}>21+ ADULTS ONLY</div>
            <p style={{ fontSize: 11, color: 'var(--text-mute)', lineHeight: 1.4 }}>
              This game is for players 21 years and older.
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="col gap-20">
          <PlayerProfile />

          <div className="panel" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 12 }}>
              <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: '.06em' }}>DAILY REWARDS</strong>
              <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>⏱ 14h 25m</span>
            </div>
            <div className="row gap-10" style={{ overflowX: 'auto', paddingBottom: 4 }}>
              {(rewards.length ? rewards : DEFAULT_REWARDS).map((r, i) => (
                <RewardCard key={r.id || i} day={r.title || `Day ${i + 1}`}
                  value={r.reward_value ?? r.value}
                  state={i === 1 ? 'active' : i === 0 ? 'claimed' : 'locked'}
                  onClaim={i === 1 ? () => nav('/rewards') : undefined} />
              ))}
            </div>
          </div>

          <div className="panel" style={{ padding: 16 }}>
            <div className="row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
              <strong style={{ fontFamily: 'var(--font-display)', letterSpacing: '.06em' }}>DAILY CHALLENGES</strong>
              <button className="btn btn-ghost" onClick={() => nav('/rewards')} style={{ padding: 4 }}>›</button>
            </div>
            {(missions.length ? missions : DEFAULT_MISSIONS).map((m, i) => (
              <MissionCard key={m.id || i} title={m.title}
                progress={m.progress ?? 0} target={m.target ?? 1}
                reward={m.reward_nexo ?? m.reward} done={m.completed ?? false} />
            ))}
            <button className="btn btn-block" onClick={() => nav('/rewards')} style={{ marginTop: 12, fontSize: 12 }}>
              View all challenges
            </button>
          </div>
        </aside>
      </div>

      {/* GAME MODES */}
      <div className="modes-row" style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginTop: 20,
      }}>
        {MODES.map((m) => (
          <GameModeCard key={m.title} {...m} onClick={() => m.to && nav(m.to)} />
        ))}
      </div>
    </div>
  )
}

const DEFAULT_REWARDS = [
  { title: 'Day 1', value: 100 }, { title: 'Day 2', value: 150 },
  { title: 'Day 3', value: 200 }, { title: 'Day 4', value: 250 }, { title: 'Day 5', value: 500 },
]
const DEFAULT_MISSIONS = [
  { title: 'Win 1 Game', target: 1, reward: 100 },
  { title: 'Play 3 Games', target: 3, reward: 200 },
  { title: 'Use 2 Hints', target: 2, reward: 150 },
]
