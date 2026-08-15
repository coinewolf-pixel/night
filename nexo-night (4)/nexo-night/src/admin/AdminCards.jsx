import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'
import { getAllCards, createCard, updateCard, deleteCard } from '../services/cards'
import { getAllModules } from '../services/modules'
import Modal from '../components/Modal'

const emptyCard = {
  module_id: '',
  title: '',
  description: '',
  image_url: '',
  card_type: 'truth',
  difficulty: 'medium',
  reward_nexo: 10,
  reward_xp: 5,
  strip_item: '',
  is_active: true,
}

export default function AdminCards() {
  const [cards, setCards] = useState([])
  const [modules, setModules] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyCard)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const [{ data: c }, { data: m }] = await Promise.all([getAllCards(), getAllModules()])
    setCards(c || [])
    setModules(m || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.strip_item) delete payload.strip_item
    if (editing) {
      await updateCard(editing, payload)
    } else {
      await createCard(payload)
    }
    setShowModal(false)
    setEditing(null)
    setForm(emptyCard)
    fetchData()
  }

  const handleEdit = (card) => {
    setEditing(card.id)
    setForm({ ...card, strip_item: card.strip_item || '' })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this card?')) return
    await deleteCard(id)
    fetchData()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Game Cards</h2>
        <button onClick={() => { setEditing(null); setForm(emptyCard); setShowModal(true) }} className="btn-primary flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Card
        </button>
      </div>

      <div className="space-y-2 max-h-[60vh] overflow-y-auto">
        {cards.map((card) => (
          <motion.div key={card.id} className="glass-panel p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">{card.title}</div>
              <div className="text-[10px] text-gray-400">{card.card_type} &bull; {card.difficulty} &bull; {card.game_modules?.title}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(card)} className="p-1.5 rounded-lg hover:bg-white/5"><Edit2 size={14} /></button>
              <button onClick={() => handleDelete(card.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={14} /></button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Card' : 'New Card'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-3">
          <select value={form.module_id} onChange={e => setForm({...form, module_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required>
            <option value="">Select Module</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
          <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="Image URL" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.card_type} onChange={e => setForm({...form, card_type: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
              {['truth', 'dare', 'choice', 'challenge', 'flirt', 'strip'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
              {['easy', 'medium', 'hard', 'extreme'].map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input type="number" value={form.reward_nexo} onChange={e => setForm({...form, reward_nexo: parseInt(e.target.value)})} placeholder="NEXO" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <input type="number" value={form.reward_xp} onChange={e => setForm({...form, reward_xp: parseInt(e.target.value)})} placeholder="XP" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <input value={form.strip_item} onChange={e => setForm({...form, strip_item: e.target.value})} placeholder="Strip item (optional)" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
            Active
          </label>
          <button type="submit" className="w-full btn-primary py-2 text-sm"><Save size={14} className="inline mr-1"/> Save</button>
        </form>
      </Modal>
    </div>
  )
}
