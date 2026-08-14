import React from 'react'
import { useAuth } from './hooks/useAuth'
import LoadingScreen from './components/LoadingScreen'
import AppRouter from './router'

export default function App() {
  const { loading, configured } = useAuth()

  if (!configured) {
    return (
      <div className="row center" style={{ minHeight: '100vh', padding: 24 }}>
        <div className="panel panel-glow fade-up" style={{ maxWidth: 520, padding: 30 }}>
          <div className="eyebrow">Setup required</div>
          <h1 className="title-glow" style={{ fontSize: 34, margin: '8px 0 12px' }}>Connect Supabase</h1>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.6 }}>
            Copy <code>.env.example</code> to <code>.env</code> and set
            <code> VITE_SUPABASE_URL</code> and <code> VITE_SUPABASE_ANON_KEY</code>,
            then restart the dev server. See <code>README.md</code> for full steps.
          </p>
        </div>
      </div>
    )
  }

  if (loading) return <LoadingScreen />
  return <AppRouter />
}
