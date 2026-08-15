import { supabase } from './supabase'

export const getRewards = async () => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('is_active', true)
    .order('required_level')
  return { data, error }
}

export const getPlayerRewards = async (playerId) => {
  const { data, error } = await supabase
    .from('player_rewards')
    .select('*, rewards(*)')
    .eq('player_id', playerId)
  return { data, error }
}

export const claimReward = async (playerId, rewardId) => {
  const { data, error } = await supabase
    .from('player_rewards')
    .insert({ player_id: playerId, reward_id: rewardId })
    .select()
  return { data, error }
}
