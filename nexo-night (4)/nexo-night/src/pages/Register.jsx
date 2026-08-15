import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, Check } from 'lucide-react'
import { signUp } from '../services/auth'

export default function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (!ageConfirmed) {
      setError('You must confirm you are 21+')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, username)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-black text-white">N</span>
          </div>
          <h1 className="text-3xl font-black neon-text">NEXO NIGHT</h1>
          <p className="text-sm text-gray-400 mt-1">Create your account</p>
        </div>

        <div className="glass-panel-strong p-6">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-nexo-pink/50 transition-colors"
                  placeholder="PlayerName"
                  required
                  minLength={3}
                  maxLength={20}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-nexo-pink/50 transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-nexo-pink/50 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-nexo-pink/50 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <div className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-colors ${
                ageConfirmed ? 'bg-nexo-pink border-nexo-pink' : 'border-white/20'
              }`}>
                {ageConfirmed && <Check size={12} className="text-white" />}
              </div>
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="hidden"
              />
              <span className="text-xs text-gray-400">
                I confirm I am 21+ years old. This game contains adult content.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-sm disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-nexo-pink hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gray-600 mt-6">
          21+ ONLY. Play responsibly.
        </p>
      </motion.div>
    </div>
  )
}
