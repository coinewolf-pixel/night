-- NEXO NIGHT — Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT NULL,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  nexo_coins INTEGER DEFAULT 100,
  gems INTEGER DEFAULT 5,
  energy INTEGER DEFAULT 10,
  energy_max INTEGER DEFAULT 10,
  clothing_items JSONB DEFAULT '{"top": true, "bottom": true, "shoes": true, "accessory": true}'::jsonb,
  preferred_character TEXT DEFAULT 'female',
  background_theme TEXT DEFAULT 'neon-club',
  difficulty TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GAME MODULES (Levels: Flirt, Hot, Dare, Finale)
-- ============================================
CREATE TABLE game_modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('flirt', 'hot', 'dare', 'finale', 'special')),
  min_level INTEGER DEFAULT 1,
  reward_nexo INTEGER DEFAULT 10,
  reward_xp INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GAME CARDS (Truth, Dare, Choice, Challenge, Flirt)
-- ============================================
CREATE TABLE game_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES game_modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  card_type TEXT NOT NULL CHECK (card_type IN ('truth', 'dare', 'choice', 'challenge', 'flirt', 'strip')),
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'extreme')),
  reward_nexo INTEGER DEFAULT 10,
  reward_xp INTEGER DEFAULT 5,
  strip_item TEXT DEFAULT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER PROGRESS
-- ============================================
CREATE TABLE player_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES game_modules(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  progress INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, module_id)
);

-- ============================================
-- GAME RESULTS
-- ============================================
CREATE TABLE game_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES game_modules(id) ON DELETE SET NULL,
  card_id UUID REFERENCES game_cards(id) ON DELETE SET NULL,
  result TEXT NOT NULL CHECK (result IN ('win', 'lose', 'draw', 'forfeit')),
  nexo_earned INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  strip_item_lost TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- DAILY MISSIONS
-- ============================================
CREATE TABLE daily_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  target_type TEXT NOT NULL CHECK (target_type IN ('wins', 'games', 'cards', 'streak')),
  target_count INTEGER DEFAULT 1,
  reward_nexo INTEGER DEFAULT 50,
  reward_xp INTEGER DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER MISSIONS
-- ============================================
CREATE TABLE player_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES daily_missions(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  claimed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, mission_id)
);

-- ============================================
-- REWARDS
-- ============================================
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  reward_type TEXT NOT NULL CHECK (reward_type IN ('avatar', 'background', 'card_skin', 'gems', 'coins', 'special')),
  reward_value INTEGER DEFAULT 0,
  required_level INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PLAYER REWARDS
-- ============================================
CREATE TABLE player_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, reward_id)
);

-- ============================================
-- ADMIN USERS
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHARACTERS (for avatar selection)
-- ============================================
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age >= 21),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RANKING
-- ============================================
CREATE TABLE ranking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  total_wins INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  total_nexo INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  rank_tier TEXT DEFAULT 'bronze' CHECK (rank_tier IN ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'legend')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

-- ============================================
-- RLS — ROW LEVEL SECURITY
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update only own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Game Modules: readable by all active
CREATE POLICY "Active modules are viewable" ON game_modules FOR SELECT USING (is_active = true);

-- Game Cards: readable by all active
CREATE POLICY "Active cards are viewable" ON game_cards FOR SELECT USING (is_active = true);

-- Player Progress: own only
CREATE POLICY "Users can read own progress" ON player_progress FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can insert own progress" ON player_progress FOR INSERT WITH CHECK (auth.uid() = player_id);
CREATE POLICY "Users can update own progress" ON player_progress FOR UPDATE USING (auth.uid() = player_id);

-- Game Results: own only, insert allowed
CREATE POLICY "Users can read own results" ON game_results FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can insert own results" ON game_results FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Daily Missions: readable by all
CREATE POLICY "Missions are viewable by everyone" ON daily_missions FOR SELECT USING (true);

-- Player Missions: own only
CREATE POLICY "Users can read own missions" ON player_missions FOR SELECT USING (auth.uid() = player_id);
CREATE POLICY "Users can update own missions" ON player_missions FOR UPDATE USING (auth.uid() = player_id);
CREATE POLICY "Users can insert own missions" ON player_missions FOR INSERT WITH CHECK (auth.uid() = player_id);

-- Rewards: readable by all active
CREATE POLICY "Active rewards are viewable" ON rewards FOR SELECT USING (is_active = true);

-- Player Rewards: own only
CREATE POLICY "Users can read own rewards" ON player_rewards FOR SELECT USING (auth.uid() = player_id);

-- Admin Users: only admins can read
CREATE POLICY "Only admins can read admin table" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
);

-- Characters: readable by all active
CREATE POLICY "Active characters are viewable" ON characters FOR SELECT USING (is_active = true);

-- Ranking: readable by all
CREATE POLICY "Ranking is viewable by everyone" ON ranking FOR SELECT USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_modules_updated_at BEFORE UPDATE ON game_modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_cards_updated_at BEFORE UPDATE ON game_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_progress_updated_at BEFORE UPDATE ON player_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_missions_updated_at BEFORE UPDATE ON player_missions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', 'player_' || substr(NEW.id::text, 1, 8)));

  INSERT INTO public.ranking (player_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to safely process game result (server-side reward calculation)
CREATE OR REPLACE FUNCTION public.process_game_result(
  p_player_id UUID,
  p_card_id UUID,
  p_result TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_card RECORD;
  v_profile RECORD;
  v_nexo INTEGER;
  v_xp INTEGER;
  v_level INTEGER;
  v_new_level INTEGER;
  v_xp_needed INTEGER;
  v_strip_item TEXT;
BEGIN
  -- Get card details
  SELECT * INTO v_card FROM game_cards WHERE id = p_card_id AND is_active = true;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Card not found');
  END IF;

  -- Get profile
  SELECT * INTO v_profile FROM profiles WHERE id = p_player_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Profile not found');
  END IF;

  -- Calculate rewards based on result
  IF p_result = 'win' THEN
    v_nexo := v_card.reward_nexo;
    v_xp := v_card.reward_xp;
  ELSIF p_result = 'lose' THEN
    v_nexo := GREATEST(0, v_card.reward_nexo / 2);
    v_xp := GREATEST(0, v_card.reward_xp / 2);
    -- Random strip item on loss
    v_strip_item := (ARRAY['top', 'bottom', 'shoes', 'accessory'])[floor(random() * 4 + 1)];
  ELSE
    v_nexo := 0;
    v_xp := 0;
  END IF;

  -- Calculate new level
  v_new_level := v_profile.level;
  v_xp_needed := v_profile.level * 100;

  IF v_profile.xp + v_xp >= v_xp_needed THEN
    v_new_level := v_profile.level + 1;
  END IF;

  -- Update profile
  UPDATE profiles SET
    nexo_coins = nexo_coins + v_nexo,
    xp = CASE WHEN v_profile.xp + v_xp >= v_xp_needed THEN v_profile.xp + v_xp - v_xp_needed ELSE v_profile.xp + v_xp END,
    level = v_new_level,
    clothing_items = CASE 
      WHEN p_result = 'lose' AND v_strip_item IS NOT NULL THEN
        jsonb_set(clothing_items, ARRAY[v_strip_item], 'false'::jsonb)
      ELSE clothing_items
    END
  WHERE id = p_player_id;

  -- Insert game result
  INSERT INTO game_results (player_id, module_id, card_id, result, nexo_earned, xp_earned, strip_item_lost)
  VALUES (p_player_id, v_card.module_id, p_card_id, p_result, v_nexo, v_xp, v_strip_item);

  -- Update ranking
  UPDATE ranking SET
    total_games = total_games + 1,
    total_wins = CASE WHEN p_result = 'win' THEN total_wins + 1 ELSE total_wins END,
    total_nexo = total_nexo + v_nexo,
    streak = CASE WHEN p_result = 'win' THEN streak + 1 ELSE 0 END,
    rank_tier = CASE
      WHEN total_wins >= 500 THEN 'legend'
      WHEN total_wins >= 200 THEN 'diamond'
      WHEN total_wins >= 100 THEN 'platinum'
      WHEN total_wins >= 50 THEN 'gold'
      WHEN total_wins >= 20 THEN 'silver'
      ELSE 'bronze'
    END
  WHERE player_id = p_player_id;

  RETURN jsonb_build_object(
    'success', true,
    'nexo_earned', v_nexo,
    'xp_earned', v_xp,
    'new_level', v_new_level,
    'leveled_up', v_new_level > v_profile.level,
    'strip_item', v_strip_item
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
