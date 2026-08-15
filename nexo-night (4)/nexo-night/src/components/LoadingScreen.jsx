import { motion } from 'framer-motion'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-nexo-darker">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-nexo-pink to-nexo-purple flex items-center justify-center mb-6"
      >
        <span className="text-3xl font-black text-white">N</span>
      </motion.div>

      <motion.h1
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-2xl font-black tracking-widest neon-text"
      >
        NEXO NIGHT
      </motion.h1>

      <div className="mt-4 flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-2 h-2 rounded-full bg-nexo-pink"
          />
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">21+ ADULTS ONLY</p>
    </div>
  )
}
