import { motion } from 'framer-motion'

export default function PlayButton({ onClick, size = 'large' }) {
  const sizes = {
    large: 'px-12 py-4 text-2xl',
    medium: 'px-8 py-3 text-lg',
    small: 'px-6 py-2 text-base'
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative ${sizes[size]} font-black tracking-wider rounded-2xl overflow-hidden`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-nexo-pink via-nexo-purple to-nexo-pink animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-nexo-pink to-nexo-purple" />
      <div className="absolute inset-0 opacity-50 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')]" />
      <span className="relative z-10 text-white drop-shadow-lg">PLAY NOW</span>
      <div className="absolute inset-0 rounded-2xl border-2 border-white/20" />
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{ boxShadow: [
          '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(124,58,237,0.3)',
          '0 0 30px rgba(236,72,153,0.7), 0 0 60px rgba(124,58,237,0.5)',
          '0 0 20px rgba(236,72,153,0.5), 0 0 40px rgba(124,58,237,0.3)'
        ]}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  )
}
