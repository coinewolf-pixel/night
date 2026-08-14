import { requireClient } from './supabase'

export async function listRewards() {
  const c = requireClient()
  const { data, error } = await c.from('rewards').select('*')
    .eq('is_active', true).order('reward_value', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function listMissions() {
  const c = requireClient()
  const { data, error } = await c.from('daily_missions').select('*').eq('is_active', true)
  if (error) throw error
  return data ?? []
}

// Make sure the player has a player_missions row for every active mission.
export async function ensurePlayerMissions() {
  const c = requireClient()
  const { error } = await c.rpc('ensure_player_missions')
  if (error) throw error
}

// Real per-player mission state (progress / completed / claimed) joined with
// the mission definition. Progress is written server-side by complete_card().
export async function getMyMissions(userId) {
  const c = requireClient()
  await ensurePlayerMissions().catch(() => {})
  const { data, error } = await c.from('player_missions')
    .select('id, progress, completed, claimed, mission:daily_missions(*)')
    .eq('player_id', userId)
  if (error) throw error
  return (data ?? [])
    .filter((r) => r.mission?.is_active)
    .map((r) => ({
      pmId: r.id,
      progress: r.progress,
      completed: r.completed,
      claimed: r.claimed,
      id: r.mission.id,
      title: r.mission.title,
      description: r.mission.description,
      target: r.mission.target,
      reward_nexo: r.mission.reward_nexo,
      reward_xp: r.mission.reward_xp,
      kind: r.mission.kind,
    }))
    .sort((a, b) => a.target - b.target)
}

// Secure claim — reward comes from the DB, one-time only.
export async function claimMission(missionId) {
  const c = requireClient()
  const { data, error } = await c.rpc('claim_mission', { p_mission_id: missionId })
  if (error) throw error
  return data
}
