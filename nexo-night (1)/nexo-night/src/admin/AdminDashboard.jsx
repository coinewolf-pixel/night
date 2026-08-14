import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ players: 0, modules: 0, cards: 0, results: 0 })

  useEffect(() => {
    async function load() {
      const count = async (t) => {
        const { count } = await supabase.from(t).select('*', { count: 'exact', head: true })
        return count ?? 0
      }
      setStats({
        players: await count('profiles'),
        modules: await count('game_modules'),
        cards: await count('game_cards'),
        results: await count('game_results'),
      })
    }
    load().catch(() => {})
  }, [])

  const cards = [
    { label: 'Players', value: stats.players, color: 'var(--pink)' },
    { label: 'Modules', value: stats.modules, color: 'var(--violet)' },
    { label: 'Cards', value: stats.cards, color: 'var(--cyan)' },
    { label: 'Games played', value: stats.results, color: 'var(--gold)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
      {cards.map((c) => (
        <div key={c.label} className="panel" style={{ padding: 20 }}>
          <div className="eyebrow">{c.label}</div>
          <strong style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: c.color }}>{c.value}</strong>
        </div>
      ))}
    </div>
  )
}
