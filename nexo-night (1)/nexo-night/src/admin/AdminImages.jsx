import React, { useState } from 'react'
import { uploadImage } from '../services/storage'

const FOLDERS = ['modules', 'cards', 'avatars', 'rewards', 'backgrounds']

export default function AdminImages() {
  const [folder, setFolder] = useState('modules')
  const [busy, setBusy] = useState(false)
  const [urls, setUrls] = useState([])
  const [err, setErr] = useState(null)

  async function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setErr(null)
    try {
      const url = await uploadImage(folder, file)
      setUrls((u) => [url, ...u])
    } catch (ex) { setErr(ex.message) } finally { setBusy(false); e.target.value = '' }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div className="panel" style={{ padding: 18 }}>
        <strong style={{ fontFamily: 'var(--font-display)' }}>Upload image</strong>
        <p style={{ color: 'var(--text-mute)', fontSize: 12, margin: '6px 0 14px' }}>
          Goes to Storage bucket <code>game-assets/{folder}</code>. Copy the returned URL into a module or card.
        </p>
        <div className="row gap-14" style={{ flexWrap: 'wrap' }}>
          <select value={folder} onChange={(e) => setFolder(e.target.value)} style={{ maxWidth: 200 }}>
            {FOLDERS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {busy ? 'Uploading…' : 'Upload Image'}
            <input type="file" accept="image/*" onChange={onFile} disabled={busy} style={{ display: 'none' }} />
          </label>
        </div>
        {err && <div className="panel" style={{ padding: 10, borderColor: 'var(--pink)', marginTop: 12 }}>{err}</div>}
      </div>

      {urls.length > 0 && (
        <div className="panel" style={{ padding: 18, marginTop: 16 }}>
          <strong style={{ fontFamily: 'var(--font-display)' }}>Uploaded</strong>
          <div className="col gap-10" style={{ marginTop: 12 }}>
            {urls.map((u) => (
              <div key={u} className="row gap-14">
                <img src={u} alt="" style={{ width: 54, height: 54, borderRadius: 10, objectFit: 'cover' }} />
                <input readOnly value={u} onFocus={(e) => e.target.select()} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
