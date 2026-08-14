import React, { useEffect, useState } from 'react'
import { listModules, createModule, updateModule, deleteModule } from '../services/modules'

const EMPTY = { title: '', description: '', category: 'quick', min_level: 1, reward_nexo: 50, reward_xp: 40, is_active: true, sort_order: 0 }

export default function AdminModules() {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [busy, setBusy] = useState(false)

  const reload = () => listModules({ activeOnly: false }).then(setRows).catch(() => {})
  useEffect(() => { reload() }, [])

  async function add() {
    if (!form.title.trim()) return
    setBusy(true)
    try {
      await createModule({
        ...form,
        min_level: Number(form.min_level), reward_nexo: Number(form.reward_nexo),
        reward_xp: Number(form.reward_xp), sort_order: Number(form.sort_order),
      })
      setForm(EMPTY); await reload()
    } catch (e) { alert(e.message) } finally { setBusy(false) }
  }

  async function toggle(m) { await updateModule(m.id, { is_active: !m.is_active }); reload() }
  async function remove(m) { if (confirm(`Delete "${m.title}"?`)) { await deleteModule(m.id); reload() } }

  return (
    <div className="row gap-20" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div className="panel" style={{ padding: 18, width: 320 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>New module</strong>
        <div className="col gap-10" style={{ marginTop: 12 }}>
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <div className="row gap-10">
            <input type="number" placeholder="Min level" value={form.min_level} onChange={(e) => setForm({ ...form, min_level: e.target.value })} />
            <input type="number" placeholder="Sort" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
          <div className="row gap-10">
            <input type="number" placeholder="Reward NEXO" value={form.reward_nexo} onChange={(e) => setForm({ ...form, reward_nexo: e.target.value })} />
            <input type="number" placeholder="Reward XP" value={form.reward_xp} onChange={(e) => setForm({ ...form, reward_xp: e.target.value })} />
          </div>
          <button className="btn-primary" disabled={busy} onClick={add}>{busy ? 'Saving…' : 'Add module'}</button>
        </div>
      </div>

      <div className="panel grow" style={{ padding: 8, minWidth: 320 }}>
        {rows.map((m) => (
          <div key={m.id} className="row" style={{ justifyContent: 'space-between', padding: '10px 14px',
            borderBottom: '1px solid var(--glass-border-soft)' }}>
            <div className="col">
              <strong>{m.title}</strong>
              <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                Lv {m.min_level} · +{m.reward_nexo}🪙 · {m.is_active ? 'active' : 'hidden'}
              </span>
            </div>
            <div className="row gap-10">
              <button className="btn" onClick={() => toggle(m)} style={{ padding: '6px 10px', fontSize: 12 }}>
                {m.is_active ? 'Hide' : 'Show'}
              </button>
              <button className="btn" onClick={() => remove(m)} style={{ padding: '6px 10px', fontSize: 12, borderColor: 'var(--pink)' }}>Del</button>
            </div>
          </div>
        ))}
        {!rows.length && <p style={{ color: 'var(--text-mute)', padding: 14 }}>No modules yet.</p>}
      </div>
    </div>
  )
}
