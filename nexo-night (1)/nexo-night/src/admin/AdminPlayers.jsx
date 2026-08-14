import React, { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'

export default function AdminPlayers() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setRows(data ?? []))
  }, [])

  return (
    <div className="panel" style={{ padding: 8 }}>
      {rows.map((p) => (
        <div key={p.id} className="row" style={{ justifyContent: 'space-between', padding: '10px 14px',
          borderBottom: '1px solid var(--glass-border-soft)' }}>
          <strong>{p.username}</strong>
          <div className="row gap-20" style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--magenta)' }}>Lv {p.level}</span>
            <span style={{ color: 'var(--cyan)' }}>{p.xp} XP</span>
            <span style={{ color: 'var(--gold)' }}>{p.nexo_coins} 🪙</span>
          </div>
        </div>
      ))}
      {!rows.length && <p style={{ color: 'var(--text-mute)', padding: 14 }}>No players yet.</p>}
      <p style={{ color: 'var(--text-mute)', fontSize: 12, padding: 14 }}>
        Admins can adjust economy fields directly (RLS grants full access via the is_admin() policy).
      </p>
    </div>
  )
}
