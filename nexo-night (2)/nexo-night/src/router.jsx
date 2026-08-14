import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Sidebar from './components/Sidebar'

import Home from './pages/Home'
import Play from './pages/Play'
import Cards from './pages/Cards'
import Avatars from './pages/Avatars'
import Shop from './pages/Shop'
import Rewards from './pages/Rewards'
import Ranking from './pages/Ranking'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Admin from './pages/Admin'

function Protected({ children }) {
  const { user } = useAuth()
  const loc = useLocation()
  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return children
}

function AdminOnly({ children }) {
  const { user, admin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!admin) return <Navigate to="/" replace />
  return children
}

function Shell({ children }) {
  return (
    <div className="app-shell">
      <Header />
      <Sidebar />
      <main className="app-main">{children}</main>
    </div>
  )
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Protected><Shell><Home /></Shell></Protected>} />
      <Route path="/play" element={<Protected><Shell><Play /></Shell></Protected>} />
      <Route path="/cards" element={<Protected><Shell><Cards /></Shell></Protected>} />
      <Route path="/avatars" element={<Protected><Shell><Avatars /></Shell></Protected>} />
      <Route path="/shop" element={<Protected><Shell><Shop /></Shell></Protected>} />
      <Route path="/rewards" element={<Protected><Shell><Rewards /></Shell></Protected>} />
      <Route path="/ranking" element={<Protected><Shell><Ranking /></Shell></Protected>} />
      <Route path="/profile" element={<Protected><Shell><Profile /></Shell></Protected>} />

      <Route path="/admin/*" element={<AdminOnly><Admin /></AdminOnly>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
