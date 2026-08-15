import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from './App'
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/play', element: <Play /> },
      { path: '/cards', element: <Cards /> },
      { path: '/avatars', element: <Avatars /> },
      { path: '/shop', element: <Shop /> },
      { path: '/rewards', element: <Rewards /> },
      { path: '/ranking', element: <Ranking /> },
      { path: '/profile', element: <Profile /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/admin', element: <Admin /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
])
