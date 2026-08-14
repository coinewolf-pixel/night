import React, { useEffect, useState } from 'react'
import { listModules } from '../services/modules'
import { listCards, createCard, updateCard, deleteCard } from '../services/cards'

const EMPTY = { title: '', description: '', card_type: 'dare', difficulty: 'normal', reward_nexo: 25, reward_xp: 20, is_active: true }

export default function AdminCards() {
  const [modules, setModules] = useState([])
  const [moduleId, setModuleId] = useState('')
  const [rows, setRows] = useState([])
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    listModules({ activeOnly: false }).then((ms) => {
      setModules(ms)
      if (ms[0]) setModuleId(ms[0].id)
    })
  }, [])

  const reload = (mid) => listCards(mid || moduleId, { activeOnly: false }).then(setRows).catch(() => {})
  useEffect(() => { if (moduleId) reload(moduleId) }, [moduleId])

  async function add() {
    if (!form.title.trim() || !moduleId) return
    try {
      await createCard({
        ...form, module_id: moduleId,
        reward_nexo: Number(form.reward_nexo), reward_xp: Number(form.reward_xp),
      })
      setForm(EMPTY); reload()
    } catch (e) { alert(e.message) }
  }
  async function toggle(c) { await updateCard(c.id, { is_active: !c.is_active }); reload() }
  async function remove(c) { if (confirm(`Delete "${c.title}"?`)) { await deleteCard(c.id); reload() } }

  return (
    <div>
      <div className="row gap-14" style={{ marginBottom: 16 }}>
        <label className="eyebrow">Module</label>
        <select value={moduleId} onChange={(e) => setModuleId(e.target.value)} style={{ maxWidth: 260 }}>
          {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      </div>

      <div className="row gap-20" style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div className="panel" style={{ padding: 18, width: 320 }}>
          <strong style={{ fontFamily: 'var(--font-display)' }}>New card</strong>
          <div className="col gap-10" style={{ marginTop: 12 }}>
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea placeholder="Prompt / description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div className="row gap-10">
              <select value={form.card_type} onChange={(e) => setForm({ ...form, card_type: e.target.value })}>
                <option value="dare">Dare</option><option value="truth">Truth</option>
              </select>
              <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                <option value="easy">Easy</option><option value="normal">Normal</option><option value="hot">Hot</option>
              </select>
            </div>
            <div className="row gap-10">
              <input type="number" placeholder="NEXO" value={form.reward_nexo} onChange={(e) => setForm({ ...form, reward_nexo: e.target.value })} />
              <input type="number" placeholder="XP" value={form.reward_xp} onChange={(e) => setForm({ ...form, reward_xp: e.target.value })} />
            </div>
            <button className="btn-primary" onClick={add}>Add card</button>
          </div>
        </div>

        <div className="panel grow" style={{ padding: 8, minWidth: 320 }}>
          {rows.map((c) => (
            <div key={c.id} className="row" style={{ justifyContent: 'space-between', padding: '10px 14px',
              borderBottom: '1px solid var(--glass-border-soft)' }}>
              <div className="col">
                <strong>{c.title} <span className="badge" style={{ marginLeft: 6 }}>{c.card_type}</span></strong>
                <span style={{ fontSize: 12, color: 'var(--text-mute)' }}>
                  {c.difficulty} · +{c.reward_nexo}🪙 · {c.is_active ? 'active' : 'hidden'}
                </span>
              </div>
              <div className="row gap-10">
                <button className="btn" onClick={() => toggle(c)} style={{ padding: '6px 10px', fontSize: 12 }}>{c.is_active ? 'Hide' : 'Show'}</button>
                <button className="btn" onClick={() => remove(c)} style={{ padding: '6px 10px', fontSize: 12, borderColor: 'var(--pink)' }}>Del</button>
              </div>
            </div>
          ))}
          {!rows.length && <p style={{ color: 'var(--text-mute)', padding: 14 }}>No cards in this module.</p>}
        </div>
      </div>
    </div>
  )
}
