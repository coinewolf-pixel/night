-- NEXO NIGHT — Seed Data
-- Run after migrations

-- Game Modules
INSERT INTO game_modules (title, description, image_url, category, min_level, reward_nexo, reward_xp, sort_order) VALUES
('Flirt Lounge', 'Soft questions and light flirting', 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=400', 'flirt', 1, 15, 10, 1),
('Hot Zone', 'Spicy questions and daring tasks', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'hot', 3, 25, 15, 2),
('Dare Chamber', 'Extreme dares and challenges', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400', 'dare', 5, 40, 25, 3),
('Finale Arena', 'Ultimate challenges for legends', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400', 'finale', 10, 100, 50, 4),
('Couple Mode', 'Special mode for two players', 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400', 'special', 1, 20, 12, 5);

-- Game Cards — Flirt
INSERT INTO game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp) VALUES
((SELECT id FROM game_modules WHERE category = 'flirt' LIMIT 1), 'First Impression', 'What was your first thought when you saw your partner?', 'truth', 'easy', 15, 10),
((SELECT id FROM game_modules WHERE category = 'flirt' LIMIT 1), 'Compliment Battle', 'Give your partner 3 genuine compliments in 30 seconds', 'challenge', 'easy', 15, 10),
((SELECT id FROM game_modules WHERE category = 'flirt' LIMIT 1), 'Eye Contact', 'Maintain intense eye contact for 60 seconds without laughing', 'challenge', 'easy', 15, 10),
((SELECT id FROM game_modules WHERE category = 'flirt' LIMIT 1), 'Secret Crush', 'Have you ever had a crush on someone in this room?', 'truth', 'easy', 15, 10),
((SELECT id FROM game_modules WHERE category = 'flirt' LIMIT 1), 'Flirty Text', 'Write a flirty message to your partner', 'challenge', 'easy', 15, 10);

-- Game Cards — Hot
INSERT INTO game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp) VALUES
((SELECT id FROM game_modules WHERE category = 'hot' LIMIT 1), 'Spicy Secret', 'What is the most adventurous place you have been intimate?', 'truth', 'medium', 25, 15),
((SELECT id FROM game_modules WHERE category = 'hot' LIMIT 1), 'Body Language', 'Describe your partner body using only emojis', 'challenge', 'medium', 25, 15),
((SELECT id FROM game_modules WHERE category = 'hot' LIMIT 1), 'Fantasy Share', 'Share a fantasy you have never told anyone', 'truth', 'medium', 25, 15),
((SELECT id FROM game_modules WHERE category = 'hot' LIMIT 1), 'Temperature Rising', 'Whisper something hot in your partner ear', 'dare', 'medium', 25, 15);

-- Game Cards — Dare
INSERT INTO game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp, strip_item) VALUES
((SELECT id FROM game_modules WHERE category = 'dare' LIMIT 1), 'Strip Dice', 'Roll the dice — if odd, remove one item', 'strip', 'hard', 40, 25, 'top'),
((SELECT id FROM game_modules WHERE category = 'dare' LIMIT 1), 'Blind Trust', 'Let your partner blindfold you for 2 minutes', 'dare', 'hard', 40, 25, NULL),
((SELECT id FROM game_modules WHERE category = 'dare' LIMIT 1), 'Truth or Strip', 'Answer honestly or remove an item', 'strip', 'hard', 40, 25, 'bottom'),
((SELECT id FROM game_modules WHERE category = 'dare' LIMIT 1), 'Dare Master', 'Complete a dare chosen by the group', 'dare', 'hard', 40, 25, NULL);

-- Game Cards — Finale
INSERT INTO game_cards (module_id, title, description, card_type, difficulty, reward_nexo, reward_xp, strip_item) VALUES
((SELECT id FROM game_modules WHERE category = 'finale' LIMIT 1), 'Ultimate Challenge', 'Perform the ultimate dare for double rewards', 'dare', 'extreme', 100, 50, NULL),
((SELECT id FROM game_modules WHERE category = 'finale' LIMIT 1), 'Legend Strip', 'Remove two items or forfeit all coins', 'strip', 'extreme', 100, 50, 'top'),
((SELECT id FROM game_modules WHERE category = 'finale' LIMIT 1), 'Final Truth', 'Reveal your deepest secret', 'truth', 'extreme', 100, 50, NULL);

-- Daily Missions
INSERT INTO daily_missions (title, description, target_type, target_count, reward_nexo, reward_xp) VALUES
('First Win', 'Win your first game today', 'wins', 1, 50, 20),
('Card Master', 'Complete 5 cards', 'cards', 5, 100, 40),
('Winning Streak', 'Win 3 games in a row', 'streak', 3, 200, 80),
('Daily Grinder', 'Play 10 games today', 'games', 10, 150, 60);

-- Rewards
INSERT INTO rewards (title, description, image_url, reward_type, reward_value, required_level) VALUES
('Neon Avatar', 'Glowing cyberpunk avatar frame', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200', 'avatar', 0, 1),
('VIP Background', 'Exclusive VIP club background', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=200', 'background', 0, 5),
('Diamond Skin', 'Diamond card skin effect', 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200', 'card_skin', 0, 10),
('Gem Pack', '50 precious gems', 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=200', 'gems', 50, 3),
('Coin Burst', '500 NEXO coins bonus', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=200', 'coins', 500, 1);

-- Characters
INSERT INTO characters (name, description, image_url, gender, age) VALUES
('Ava', 'Mysterious brunette with a wild side', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 'female', 24),
('Luna', 'Blonde bombshell who loves challenges', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200', 'female', 22),
('Max', 'Charming rebel with a dark past', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200', 'male', 26),
('Leo', 'Athletic adventurer seeking thrills', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', 'male', 25),
('Zoe', 'Alternative beauty with piercings', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 'female', 23),
('Alex', 'Androgynous model breaking boundaries', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', 'other', 27);
