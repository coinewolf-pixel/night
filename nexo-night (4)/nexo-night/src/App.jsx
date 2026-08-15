import { Outlet, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const { user, profile, admin, loading } = useAuth()
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  if (loading) return <LoadingScreen />

  if (!user && !isAuthPage) {
    return <Navigate to="/login" replace />
  }

  if (user && isAuthPage) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="min-h-screen bg-nexo-darker">
      {!isAuthPage && <Header user={user} profile={profile} admin={admin} />}
      {!isAuthPage && <Sidebar />}

      <main className={`${!isAuthPage ? 'lg:ml-56' : ''}`}>
        <Outlet />
      </main>
    </div>
  )
}
