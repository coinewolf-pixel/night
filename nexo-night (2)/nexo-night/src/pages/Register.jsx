import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../services/auth'
import { AuthShell } from './Login'

export default function Register() {
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState(false)
  const [err, setErr] = useState(null)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setErr(null); setMsg(null)
    if (!age) { setErr('You must confirm you are 21 or older.'); return }
    if (username.trim().length < 3) { setErr('Username must be at least 3 characters.'); return }
    setBusy(true)
    try {
      await signUp({ email, password, username: username.trim() })
      setMsg('Account created. Check your email if confirmation is enabled, then sign in.')
      setTimeout(() => nav('/login'), 1600)
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <AuthShell subtitle="Create your account. Must be 21 or older.">
      {err && <div className="panel" style={{ padding: 12, borderColor: 'var(--pink)', marginBottom: 12 }}>{err}</div>}
      {msg && <div className="panel" style={{ padding: 12, borderColor: 'var(--green)', marginBottom: 12 }}>{msg}</div>}
      <div className="col gap-14">
        <div className="col gap-6">
          <label className="eyebrow">Username</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nexorian" />
        </div>
        <div className="col gap-6">
          <label className="eyebrow">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div className="col gap-6">
          <label className="eyebrow">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
        </div>
        <label className="row gap-10" style={{ cursor: 'pointer' }}>
          <input type="checkbox" checked={age} onChange={(e) => setAge(e.target.checked)} style={{ width: 18 }} />
          <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>I confirm I am 21 years or older.</span>
        </label>
        <button className="btn-primary btn-block" disabled={busy} onClick={submit}>
          {busy ? 'Creating…' : 'Create account'}
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text-mute)', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--pink)' }}>Sign in</Link>
        </p>
      </div>
    </AuthShell>
  )
}
