-- ============================================
-- CineCircle: Seed Movies for CineMate Users
-- ============================================
-- Adds ~10 movies per CineMate user (7 watched + 3 watchlist)
-- based on their taste profiles. Poster paths will be populated
-- by calling /api/seed-posters after running this migration.

-- ─────────────────────────────────────────────────────────────────────
-- Aarav Kapoor — Sci-Fi, Slow Burn, Thriller (Nolan fanatic)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 27205,  'Inception',          ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '45 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 157336, 'Interstellar',       ARRAY['Sci-Fi','Drama'],               NULL, NOW() - INTERVAL '38 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 335984, 'Blade Runner 2049',  ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 577922, 'Tenet',              ARRAY['Sci-Fi','Action'],              NULL, NOW() - INTERVAL '22 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 329865, 'Arrival',            ARRAY['Sci-Fi','Drama'],               NULL, NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 264660, 'Ex Machina',         ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '10 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 603,    'The Matrix',         ARRAY['Sci-Fi','Action'],              NULL, NOW() - INTERVAL '5 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 438631, 'Dune',               ARRAY['Sci-Fi','Adventure'],           NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 872585, 'Oppenheimer',        ARRAY['Drama','Thriller'],             NULL, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 300668, 'Annihilation',       ARRAY['Sci-Fi','Horror'],              NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Zoya Mirza — Romance, Indie, Drama (emotionally damaging endings)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 313369, 'La La Land',                        ARRAY['Romance','Musical'],      NULL, NOW() - INTERVAL '42 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 38,     'Eternal Sunshine of the Spotless Mind', ARRAY['Romance','Drama'],    NULL, NOW() - INTERVAL '35 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 11036,  'The Notebook',                      ARRAY['Romance','Drama'],        NULL, NOW() - INTERVAL '28 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 19913,  '(500) Days of Summer',              ARRAY['Romance','Comedy'],       NULL, NOW() - INTERVAL '20 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 398818, 'Call Me by Your Name',               ARRAY['Romance','Drama'],        NULL, NOW() - INTERVAL '14 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 4348,   'Pride & Prejudice',                 ARRAY['Romance','Drama'],        NULL, NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 122906, 'About Time',                        ARRAY['Romance','Fantasy'],      NULL, NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 666277, 'Past Lives',                        ARRAY['Romance','Drama'],        NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 80,     'Before Sunrise',                    ARRAY['Romance','Drama'],        NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 639,    'When Harry Met Sally...',           ARRAY['Romance','Comedy'],       NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Ethan Blake — Superhero, Dark Comedy, Psychological (Marvel + A24)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 545611, 'Everything Everywhere All at Once', ARRAY['Action','Sci-Fi','Comedy'],   NULL, NOW() - INTERVAL '40 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 414906, 'The Batman',                       ARRAY['Action','Crime'],              NULL, NOW() - INTERVAL '33 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 634649, 'Spider-Man: No Way Home',          ARRAY['Action','Superhero'],           NULL, NOW() - INTERVAL '26 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 493922, 'Hereditary',                       ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '19 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 118340, 'Guardians of the Galaxy',          ARRAY['Action','Superhero','Comedy'],  NULL, NOW() - INTERVAL '13 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 419430, 'Get Out',                          ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 299534, 'Avengers: Endgame',                ARRAY['Action','Superhero'],           NULL, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 530385, 'Midsommar',                        ARRAY['Horror','Drama'],              NULL, NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 792307, 'Poor Things',                      ARRAY['Comedy','Drama','Sci-Fi'],     NULL, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 496243, 'Parasite',                         ARRAY['Thriller','Drama'],            NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Sana Sheikh — Mystery, Thriller, Crime (plot twists)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 210577, 'Gone Girl',                         ARRAY['Thriller','Mystery'],           NULL, NOW() - INTERVAL '44 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 11324,  'Shutter Island',                    ARRAY['Thriller','Mystery'],           NULL, NOW() - INTERVAL '36 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 546554, 'Knives Out',                        ARRAY['Mystery','Comedy','Crime'],     NULL, NOW() - INTERVAL '29 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 807,    'Se7en',                             ARRAY['Thriller','Crime'],             NULL, NOW() - INTERVAL '21 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 146233, 'Prisoners',                         ARRAY['Thriller','Drama'],             NULL, NOW() - INTERVAL '14 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 1124,   'The Prestige',                      ARRAY['Thriller','Mystery'],           NULL, NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 1949,   'Zodiac',                            ARRAY['Thriller','Crime'],             NULL, NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 661374, 'Glass Onion: A Knives Out Mystery', ARRAY['Mystery','Comedy','Crime'],     NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 65754,  'The Girl with the Dragon Tattoo',   ARRAY['Thriller','Mystery'],           NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 322,    'Mystic River',                      ARRAY['Crime','Drama','Thriller'],     NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Liam Carter — Sci-Fi, Emotional Drama, Mind-Bending (time travel)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 122906, 'About Time',                        ARRAY['Romance','Fantasy'],            NULL, NOW() - INTERVAL '43 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 59967,  'Looper',                            ARRAY['Sci-Fi','Action','Thriller'],   NULL, NOW() - INTERVAL '35 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 137113, 'Edge of Tomorrow',                  ARRAY['Sci-Fi','Action'],              NULL, NOW() - INTERVAL '27 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 141,    'Donnie Darko',                      ARRAY['Sci-Fi','Drama','Thriller'],    NULL, NOW() - INTERVAL '20 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 45612,  'Source Code',                       ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '13 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 59436,  'Midnight in Paris',                 ARRAY['Romance','Comedy','Fantasy'],   NULL, NOW() - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 206487, 'Predestination',                    ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 220724, 'Coherence',                         ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 372058, 'Your Name.',                        ARRAY['Animation','Romance'],          NULL, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 1954,   'The Butterfly Effect',              ARRAY['Sci-Fi','Thriller'],            NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Maya Fernandes — Bollywood, Musical, Feel-Good
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 20453,  '3 Idiots',                          ARRAY['Comedy','Drama'],               NULL, NOW() - INTERVAL '41 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 360814, 'Dangal',                            ARRAY['Drama','Sport'],                NULL, NOW() - INTERVAL '34 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 354912, 'Coco',                              ARRAY['Animation','Family','Musical'], NULL, NOW() - INTERVAL '26 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 313369, 'La La Land',                        ARRAY['Romance','Musical'],            NULL, NOW() - INTERVAL '18 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 194,    'Amélie',                            ARRAY['Romance','Comedy'],             NULL, NOW() - INTERVAL '12 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 508442, 'Soul',                              ARRAY['Animation','Comedy','Fantasy'], NULL, NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 467244, 'The Greatest Showman',              ARRAY['Musical','Drama'],              NULL, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 579974, 'RRR',                               ARRAY['Action','Drama'],               NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 346698, 'Barbie',                            ARRAY['Comedy','Fantasy'],             NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 637,    'Life Is Beautiful',                 ARRAY['Comedy','Drama'],               NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Rohan D'Souza — Horror, Slasher, Dark
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 138843, 'The Conjuring',                    ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '39 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 493922, 'Hereditary',                       ARRAY['Horror','Drama'],               NULL, NOW() - INTERVAL '31 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 447332, 'A Quiet Place',                    ARRAY['Horror','Sci-Fi'],              NULL, NOW() - INTERVAL '24 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 346364, 'It',                               ARRAY['Horror'],                       NULL, NOW() - INTERVAL '17 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 694,    'The Shining',                      ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '11 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 4232,   'Scream',                           ARRAY['Horror','Slasher'],             NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 419430, 'Get Out',                          ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 760104, 'Smile',                            ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 756999, 'The Black Phone',                  ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 893723, 'Barbarian',                        ARRAY['Horror','Thriller'],            NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Chloe Bennett — Aesthetic, Indie, Slow Cinema
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 120467, 'The Grand Budapest Hotel',         ARRAY['Comedy','Drama'],               NULL, NOW() - INTERVAL '37 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 376867, 'Moonlight',                        ARRAY['Drama'],                        NULL, NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 152601, 'Her',                              ARRAY['Romance','Sci-Fi','Drama'],     NULL, NOW() - INTERVAL '23 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 153,    'Lost in Translation',              ARRAY['Drama','Comedy'],               NULL, NOW() - INTERVAL '16 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 391713, 'Lady Bird',                        ARRAY['Drama','Comedy'],               NULL, NOW() - INTERVAL '10 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 399174, 'The Florida Project',              ARRAY['Drama'],                        NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 194,    'Amélie',                           ARRAY['Romance','Comedy'],             NULL, NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 542178, 'Portrait of a Lady on Fire',       ARRAY['Drama','Romance'],              NULL, NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 804095, 'Aftersun',                         ARRAY['Drama'],                        NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 666277, 'Past Lives',                       ARRAY['Romance','Drama'],              NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Yusuf Khan — Crime, Noir, Action (gangster antiheroes)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 238,    'The Godfather',                    ARRAY['Crime','Drama'],                NULL, NOW() - INTERVAL '46 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 680,    'Pulp Fiction',                     ARRAY['Crime','Thriller'],             NULL, NOW() - INTERVAL '38 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 155,    'The Dark Knight',                  ARRAY['Action','Crime','Thriller'],    NULL, NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 6977,   'No Country for Old Men',           ARRAY['Crime','Thriller'],             NULL, NOW() - INTERVAL '22 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 769,    'Goodfellas',                       ARRAY['Crime','Drama'],                NULL, NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 949,    'Heat',                             ARRAY['Crime','Action','Thriller'],    NULL, NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 64690,  'Drive',                            ARRAY['Crime','Drama','Action'],       NULL, NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 273481, 'Sicario',                          ARRAY['Crime','Thriller','Action'],    NULL, NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 524,    'Casino',                           ARRAY['Crime','Drama'],                NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 49026,  'The Dark Knight Rises',            ARRAY['Action','Crime','Thriller'],    NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Elena Rossi — Foreign Cinema, Drama, Art House
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 11216,  'Cinema Paradiso',                  ARRAY['Drama','Romance'],              NULL, NOW() - INTERVAL '48 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 496243, 'Parasite',                         ARRAY['Thriller','Drama'],             NULL, NOW() - INTERVAL '39 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 129,    'Spirited Away',                    ARRAY['Animation','Fantasy'],          NULL, NOW() - INTERVAL '31 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 1417,   'Pan''s Labyrinth',                 ARRAY['Fantasy','Drama','War'],        NULL, NOW() - INTERVAL '23 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 637,    'Life Is Beautiful',                ARRAY['Comedy','Drama'],               NULL, NOW() - INTERVAL '16 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 505600, 'Roma',                             ARRAY['Drama'],                        NULL, NOW() - INTERVAL '9 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 194,    'Amélie',                           ARRAY['Romance','Comedy'],             NULL, NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 381284, 'The Handmaiden',                   ARRAY['Thriller','Drama','Romance'],   NULL, NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 843,    'In the Mood for Love',             ARRAY['Drama','Romance'],              NULL, NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 542178, 'Portrait of a Lady on Fire',       ARRAY['Drama','Romance'],              NULL, NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;
