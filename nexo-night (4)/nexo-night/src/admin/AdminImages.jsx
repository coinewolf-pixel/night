import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Copy, Check } from 'lucide-react'
import { uploadImage } from '../services/storage'
import Modal from '../components/Modal'

const folders = ['modules', 'cards', 'avatars', 'rewards', 'backgrounds']

export default function AdminImages() {
  const [selectedFolder, setSelectedFolder] = useState('modules')
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, selectedFolder)
      setUploadedUrl(url)
      setShowModal(true)
    } catch (err) {
      alert('Upload failed: ' + err.message)
    }
    setUploading(false)
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(uploadedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Image Upload</h2>

      <div className="flex gap-2 mb-4 overflow-x-auto">
        {folders.map(f => (
          <button key={f} onClick={() => setSelectedFolder(f)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${selectedFolder === f ? 'bg-nexo-pink text-white' : 'bg-white/5 text-gray-400'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="glass-panel p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Upload size={28} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-400 mb-4">Upload to: <span className="text-nexo-pink font-medium">{selectedFolder}/</span></p>

        <label className="btn-primary inline-flex items-center gap-2 cursor-pointer">
          <Upload size={16} />
          {uploading ? 'Uploading...' : 'Select Image'}
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Upload Complete" size="sm">
        <div className="space-y-3">
          <div className="rounded-lg overflow-hidden bg-white/5">
            <img src={uploadedUrl} alt="Uploaded" className="w-full h-40 object-cover" />
          </div>
          <div className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
            <input value={uploadedUrl} readOnly className="flex-1 bg-transparent text-xs truncate" />
            <button onClick={copyUrl} className="p-1.5 rounded-lg hover:bg-white/10">
              {copied ? <Check size={14} className="text-nexo-success" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-[10px] text-gray-400">Copy this URL and paste it when creating modules/cards/characters.</p>
        </div>
      </Modal>
    </div>
  )
}
