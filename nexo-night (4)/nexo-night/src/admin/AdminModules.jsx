import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'
import { getAllModules, createModule, updateModule, deleteModule } from '../services/modules'
import Modal from '../components/Modal'

const emptyModule = {
  title: '',
  description: '',
  image_url: '',
  category: 'flirt',
  min_level: 1,
  reward_nexo: 10,
  reward_xp: 5,
  is_active: true,
  sort_order: 0,
}

export default function AdminModules() {
  const [modules, setModules] = useState([])
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyModule)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    const { data } = await getAllModules()
    setModules(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editing) {
      await updateModule(editing, form)
    } else {
      await createModule(form)
    }
    setShowModal(false)
    setEditing(null)
    setForm(emptyModule)
    fetchModules()
  }

  const handleEdit = (mod) => {
    setEditing(mod.id)
    setForm({ ...mod })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this module?')) return
    await deleteModule(id)
    fetchModules()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Game Modules</h2>
        <button onClick={() => { setEditing(null); setForm(emptyModule); setShowModal(true) }} className="btn-primary flex items-center gap-2 text-xs">
          <Plus size={14} /> Add Module
        </button>
      </div>

      <div className="space-y-2">
        {modules.map((mod) => (
          <motion.div key={mod.id} className="glass-panel p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">{mod.title}</div>
              <div className="text-[10px] text-gray-400">{mod.category} &bull; Level {mod.min_level}+ &bull; {mod.is_active ? 'Active' : 'Inactive'}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(mod)} className="p-1.5 rounded-lg hover:bg-white/5">
                <Edit2 size={14} />
              </button>
              <button onClick={() => handleDelete(mod.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? 'Edit Module' : 'New Module'}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" required />
          <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} placeholder="Image URL" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
            {['flirt', 'hot', 'dare', 'finale', 'special'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input type="number" value={form.min_level} onChange={e => setForm({...form, min_level: parseInt(e.target.value)})} placeholder="Min Level" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <input type="number" value={form.reward_nexo} onChange={e => setForm({...form, reward_nexo: parseInt(e.target.value)})} placeholder="NEXO Reward" className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
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
