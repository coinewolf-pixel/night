import { useAuth } from './useAuth'

// Convenience accessor for the current player's economy + identity.
export function usePlayer() {
  const { profile, refreshProfile, setProfile } = useAuth()
  const xpForLevel = (profile?.level ?? 1) * 1000
  const xpInLevel = (profile?.xp ?? 0) % 1000
  return {
    profile,
    coins: profile?.nexo_coins ?? 0,
    gems: profile?.gems ?? 0,
    energy: profile?.energy ?? 0,
    energyMax: profile?.energy_max ?? 10,
    level: profile?.level ?? 1,
    xp: profile?.xp ?? 0,
    xpInLevel,
    xpForLevel: 1000,
    xpPct: Math.min(100, Math.round((xpInLevel / 1000) * 100)),
    refreshProfile,
    setProfile,
  }
}
