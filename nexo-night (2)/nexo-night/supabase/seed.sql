-- ============================================================================
-- NEXO NIGHT — seed content (run AFTER 001_initial_schema.sql)
-- Safe demo content only. Flirty, non-explicit prompts.
-- ============================================================================

insert into public.game_modules (title, description, category, min_level, reward_nexo, reward_xp, sort_order)
values
  ('Quick Match',    'Find a random partner and break the ice.', 'quick',  1, 50,  40, 1),
  ('Story Mode',     'Levels and adventures for two.',           'story',  1, 80,  60, 2),
  ('Hot Challenges', 'Bolder dares for confident players.',      'hot',    5, 120, 90, 3),
  ('Couple Mode',    'Designed for couples who know each other.','couple', 3, 100, 75, 4);

-- Cards for "Quick Match"
insert into public.game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp)
select id, 'Two Truths', 'Tell your partner two true things about yourself and one you wish were true.', 'truth', 'easy', 20, 15 from public.game_modules where title = 'Quick Match';
insert into public.game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp)
select id, 'Best Compliment', 'Give the most genuine compliment you can think of.', 'dare', 'easy', 25, 20 from public.game_modules where title = 'Quick Match';
insert into public.game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp)
select id, 'First Impression', 'Describe your very first impression of your partner in one sentence.', 'truth', 'normal', 30, 25 from public.game_modules where title = 'Quick Match';

-- Cards for "Story Mode"
insert into public.game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp)
select id, 'The Meeting', 'Act out how you imagine you two first met in a movie.', 'dare', 'normal', 40, 30 from public.game_modules where title = 'Story Mode';
insert into public.game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp)
select id, 'Secret Wish', 'Share one adventure you would love to go on together.', 'truth', 'normal', 40, 30 from public.game_modules where title = 'Story Mode';

-- Daily missions
insert into public.daily_missions (title, description, target, reward_nexo, reward_xp, kind)
values
  ('Win 1 Game',   'Complete a single card.',    1, 100, 50, 'complete_card'),
  ('Play 3 Games', 'Complete three cards today.', 3, 200, 90, 'complete_card'),
  ('Use 2 Hints',  'Use two hints in any mode.',  2, 150, 60, 'hint');

-- Rewards catalog (daily-reward ladder)
insert into public.rewards (title, description, reward_type, reward_value, required_level)
values
  ('Day 1', 'Daily login reward', 'nexo', 100, 1),
  ('Day 2', 'Daily login reward', 'nexo', 150, 1),
  ('Day 3', 'Daily login reward', 'nexo', 200, 1),
  ('Day 4', 'Daily login reward', 'nexo', 250, 1),
  ('Day 5', 'Daily login reward', 'nexo', 500, 1);
