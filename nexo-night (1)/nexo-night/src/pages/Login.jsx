import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { signIn } from '../services/auth'

export default function Login() {
  const nav = useNavigate()
  const loc = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [busy, setBusy] = useState(false)

  async function submit() {
    setErr(null); setBusy(true)
    try {
      await signIn({ email, password })
      nav(loc.state?.from || '/', { replace: true })
    } catch (e) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <AuthShell subtitle="Welcome back. Sign in to continue the night.">
      {err && <div className="panel" style={{ padding: 12, borderColor: 'var(--pink)', marginBottom: 12 }}>{err}</div>}
      <div className="col gap-14">
        <div className="col gap-6">
          <label className="eyebrow">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="you@example.com" />
        </div>
        <div className="col gap-6">
          <label className="eyebrow">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()} placeholder="••••••••" />
        </div>
        <button className="btn-primary btn-block" disabled={busy} onClick={submit}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p style={{ textAlign: 'center', color: 'var(--text-mute)', fontSize: 14 }}>
          No account? <Link to="/register" style={{ color: 'var(--pink)' }}>Create one</Link>
        </p>
      </div>
    </AuthShell>
  )
}

export function AuthShell({ children, subtitle }) {
  return (
    <div className="row center" style={{ minHeight: '100vh', padding: 20 }}>
      <div className="panel panel-glow fade-up" style={{ width: '100%', maxWidth: 420, padding: 30 }}>
        <div className="col center" style={{ marginBottom: 18 }}>
          <h1 className="title-glow" style={{ fontSize: 42 }}>NEXO<span style={{ color: 'var(--pink)', fontStyle: 'italic' }}> NIGHT</span></h1>
          <span className="badge" style={{ marginTop: 6 }}>21+ ADULTS ONLY</span>
          <p style={{ color: 'var(--text-dim)', marginTop: 12, textAlign: 'center', fontSize: 14 }}>{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )
}
