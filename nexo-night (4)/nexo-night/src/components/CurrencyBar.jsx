export default function CurrencyBar({ profile }) {
  if (!profile) return null

  return (
    <div className="flex items-center gap-4 px-4 py-2">
      <div className="flex items-center gap-1.5">
        <div className="w-5 h-5 rounded-full bg-nexo-gold/20 flex items-center justify-center text-nexo-gold text-[10px] font-bold">N</div>
        <span className="text-sm font-semibold">{profile.nexo_coins?.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-nexo-purple text-sm">♦</span>
        <span className="text-sm font-semibold">{profile.gems}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-nexo-cyan text-sm">⚡</span>
        <span className="text-sm font-semibold">{profile.energy}/{profile.energy_max}</span>
      </div>
    </div>
  )
}
