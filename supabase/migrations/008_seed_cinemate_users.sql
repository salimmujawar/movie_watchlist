-- ============================================
-- CineCircle: Seed CineMate Users
-- ============================================
-- Creates the 10 discoverable CineMate profiles
-- so they have real user rows to link to.
-- Uses a "cinemate_" prefix on google_id to mark them as seed data.

INSERT INTO users (google_id, name, first_name, last_name, email, profile_image, onboarding_completed, bio, is_active)
VALUES
  ('cinemate_aarav',   'Aarav Kapoor',     'Aarav',   'Kapoor',     'aarav@cinecircle.demo',   NULL, true, 'Lives for Nolan, neon noir & existential sci-fi.',             true),
  ('cinemate_zoya',    'Zoya Mirza',       'Zoya',    'Mirza',      'zoya@cinecircle.demo',    NULL, true, 'Rom-coms, rainy films & emotionally damaging endings.',        true),
  ('cinemate_ethan',   'Ethan Blake',      'Ethan',   'Blake',      'ethan@cinecircle.demo',   NULL, true, 'Marvel by day, A24 by night.',                                 true),
  ('cinemate_sana',    'Sana Sheikh',      'Sana',    'Sheikh',     'sana@cinecircle.demo',    NULL, true, 'Plot twists > happy endings.',                                 true),
  ('cinemate_liam',    'Liam Carter',      'Liam',    'Carter',     'liam@cinecircle.demo',    NULL, true, 'Give me time travel and heartbreak.',                           true),
  ('cinemate_maya',    'Maya Fernandes',   'Maya',    'Fernandes',  'maya@cinecircle.demo',    NULL, true, 'Bollywood classics & comfort movies forever.',                 true),
  ('cinemate_rohan',   'Rohan D''Souza',   'Rohan',   'D''Souza',   'rohan@cinecircle.demo',   NULL, true, 'Horror movies are my therapy.',                                true),
  ('cinemate_chloe',   'Chloe Bennett',    'Chloe',   'Bennett',    'chloe@cinecircle.demo',   NULL, true, 'Obsessed with visually beautiful cinema.',                     true),
  ('cinemate_yusuf',   'Yusuf Khan',       'Yusuf',   'Khan',       'yusuf@cinecircle.demo',   NULL, true, 'Neo-noir, gangster films & chaotic antiheroes.',               true),
  ('cinemate_elena',   'Elena Rossi',      'Elena',   'Rossi',      'elena@cinecircle.demo',   NULL, true, 'French films, heartbreak & long monologues.',                  true)
ON CONFLICT (google_id) DO NOTHING;
