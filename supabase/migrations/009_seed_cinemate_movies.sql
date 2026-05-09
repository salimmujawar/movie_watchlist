-- ============================================
-- CineCircle: Seed Movies for CineMate Users
-- ============================================
-- Adds ~10 movies per CineMate user (7 watched + 3 watchlist)
-- based on their taste profiles, with real TMDB poster paths.

-- ─────────────────────────────────────────────────────────────────────
-- Aarav Kapoor — Sci-Fi, Slow Burn, Thriller (Nolan fanatic)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 27205,  'Inception',          ARRAY['Sci-Fi','Thriller'],   '/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg', NOW() - INTERVAL '45 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 157336, 'Interstellar',       ARRAY['Sci-Fi','Drama'],      '/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg', NOW() - INTERVAL '38 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 335984, 'Blade Runner 2049',  ARRAY['Sci-Fi','Thriller'],   '/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg', NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 577922, 'Tenet',              ARRAY['Sci-Fi','Action'],     '/aCIFMriQh8rvhxpN1IWGgvH0Tlg.jpg', NOW() - INTERVAL '22 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 329865, 'Arrival',            ARRAY['Sci-Fi','Drama'],      '/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg', NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 264660, 'Ex Machina',         ARRAY['Sci-Fi','Thriller'],   '/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg', NOW() - INTERVAL '10 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 603,    'The Matrix',         ARRAY['Sci-Fi','Action'],     '/aOIuZAjPaRIE6CMzbazvcHuHXDc.jpg', NOW() - INTERVAL '5 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 438631, 'Dune',               ARRAY['Sci-Fi','Adventure'], '/gDzOcq0pfeCeqMBwKIJlSmQpjkZ.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 872585, 'Oppenheimer',        ARRAY['Drama','Thriller'],   '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_aarav'), 300668, 'Annihilation',       ARRAY['Sci-Fi','Horror'],    '/4YRplSk6BhH6PRuE9gfyw9byUJ6.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Zoya Mirza — Romance, Indie, Drama (emotionally damaging endings)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 313369, 'La La Land',                            ARRAY['Romance','Musical'],  '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', NOW() - INTERVAL '42 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 38,     'Eternal Sunshine of the Spotless Mind', ARRAY['Romance','Drama'],    '/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg', NOW() - INTERVAL '35 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 11036,  'The Notebook',                          ARRAY['Romance','Drama'],    '/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg', NOW() - INTERVAL '28 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 19913,  '(500) Days of Summer',                  ARRAY['Romance','Comedy'],   '/qXAuQ9hF30sQRsXf40OfRVl0MJZ.jpg', NOW() - INTERVAL '20 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 398818, 'Call Me by Your Name',                  ARRAY['Romance','Drama'],    '/mZ4gBdfkhP9tvLH1DO4m4HYtiyi.jpg', NOW() - INTERVAL '14 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 4348,   'Pride & Prejudice',                     ARRAY['Romance','Drama'],    '/o8UhmEbWPHmTUxP0lMuCoqNkbB3.jpg', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 122906, 'About Time',                            ARRAY['Romance','Fantasy'],  '/ls6zswrOZVhCXQBh96DlbnLBajM.jpg', NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 666277, 'Past Lives',              ARRAY['Romance','Drama'],  '/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 76,     'Before Sunrise',          ARRAY['Romance','Drama'],  '/kf1Jb1c2JAOqjuzA3H4oDM263uB.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_zoya'), 639,    'When Harry Met Sally...', ARRAY['Romance','Comedy'], '/rFOiFUhTMtDetqCGClC9PIgnC1P.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Ethan Blake — Superhero, Dark Comedy, Psychological (Marvel + A24)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 545611, 'Everything Everywhere All at Once', ARRAY['Action','Sci-Fi','Comedy'],  '/u68AjlvlutfEIcpmbYpKcdi09ut.jpg', NOW() - INTERVAL '40 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 414906, 'The Batman',                       ARRAY['Action','Crime'],             '/74xTEgt7R36Fpooo50r9T25onhq.jpg', NOW() - INTERVAL '33 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 634649, 'Spider-Man: No Way Home',          ARRAY['Action','Superhero'],          '/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', NOW() - INTERVAL '26 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 493922, 'Hereditary',                       ARRAY['Horror','Thriller'],           '/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg', NOW() - INTERVAL '19 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 118340, 'Guardians of the Galaxy',          ARRAY['Action','Superhero','Comedy'], '/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg', NOW() - INTERVAL '13 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 419430, 'Get Out',                          ARRAY['Horror','Thriller'],           '/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 299534, 'Avengers: Endgame',                ARRAY['Action','Superhero'],          '/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg', NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 530385, 'Midsommar',    ARRAY['Horror','Drama'],          '/7LEI8ulZzO5gy9Ww2NVCrKmHeDZ.jpg', NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 792307, 'Poor Things',  ARRAY['Comedy','Drama','Sci-Fi'], '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_ethan'), 496243, 'Parasite',     ARRAY['Thriller','Drama'],        '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Sana Sheikh — Mystery, Thriller, Crime (plot twists)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 210577, 'Gone Girl',      ARRAY['Thriller','Mystery'],       '/ts996lKsxvjkO2yiYG0ht4qAicO.jpg', NOW() - INTERVAL '44 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 11324,  'Shutter Island', ARRAY['Thriller','Mystery'],       '/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg', NOW() - INTERVAL '36 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 546554, 'Knives Out',     ARRAY['Mystery','Comedy','Crime'], '/pThyQovXQrw2m0s9x82twj48Jq4.jpg', NOW() - INTERVAL '29 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 807,    'Se7en',          ARRAY['Thriller','Crime'],         '/191nKfP0ehp3uIvWqgPbFmI4lv9.jpg', NOW() - INTERVAL '21 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 146233, 'Prisoners',      ARRAY['Thriller','Drama'],         '/jsS3a3ep2KyBVmmiwaz3LvK49b1.jpg', NOW() - INTERVAL '14 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 1124,   'The Prestige',   ARRAY['Thriller','Mystery'],       '/Ag2B2KHKQPukjH7WutmgnnSNurZ.jpg', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 1949,   'Zodiac',         ARRAY['Thriller','Crime'],         '/6YmeO4pB7XTh8P8F960O1uA14JO.jpg', NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 661374, 'Glass Onion: A Knives Out Mystery', ARRAY['Mystery','Comedy','Crime'], '/vDGr1YdrlfbU9wxTOdpf3zChmv9.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 65754,  'The Girl with the Dragon Tattoo',  ARRAY['Thriller','Mystery'],       '/8bokS83zGdhaXgN9tjidUKmAftW.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_sana'), 322,    'Mystic River',                     ARRAY['Crime','Drama','Thriller'], '/hCHVDbo6XJGj3r2i4hVjKhE0GKF.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Liam Carter — Sci-Fi, Emotional Drama, Mind-Bending (time travel)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 122906, 'About Time',        ARRAY['Romance','Fantasy'],          '/ls6zswrOZVhCXQBh96DlbnLBajM.jpg', NOW() - INTERVAL '43 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 59967,  'Looper',            ARRAY['Sci-Fi','Action','Thriller'], '/sNjL6SqErDBE8OUZlrDLkexfsCj.jpg', NOW() - INTERVAL '35 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 137113, 'Edge of Tomorrow',  ARRAY['Sci-Fi','Action'],            '/nBM9MMa2WCwvMG4IJ3eiGUdbPe6.jpg', NOW() - INTERVAL '27 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 141,    'Donnie Darko',      ARRAY['Sci-Fi','Drama','Thriller'],  '/sv7D4vlfIH25lNjQYoXzoOFCYaz.jpg', NOW() - INTERVAL '20 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 45612,  'Source Code',       ARRAY['Sci-Fi','Thriller'],          '/nTr0lvAzeQmUjgSgDEHTJpnrxTz.jpg', NOW() - INTERVAL '13 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 59436,  'Midnight in Paris', ARRAY['Romance','Comedy','Fantasy'], '/4wBG5kbfagTQclETblPRRGihk0I.jpg', NOW() - INTERVAL '7 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 206487, 'Predestination',    ARRAY['Sci-Fi','Thriller'],          '/38Xr1JnV1ZcLQ55zmdSp6n475cZ.jpg', NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 220289, 'Coherence',            ARRAY['Sci-Fi','Thriller'],   '/ezUtb9m5DeLwL2gxi4gktzNCvQv.jpg', NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 372058, 'Your Name.',           ARRAY['Animation','Romance'], '/q719jXXEzOoYaps6babgKnONONX.jpg', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_liam'), 1954,   'The Butterfly Effect', ARRAY['Sci-Fi','Thriller'],   '/ea5iv7TWMh18fOKoRGgmtcg85Gx.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Maya Fernandes — Bollywood, Musical, Feel-Good
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 20453,  '3 Idiots',              ARRAY['Comedy','Drama'],               '/66A9MqXOyVFCssoloscw79z8Tew.jpg', NOW() - INTERVAL '41 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 360814, 'Dangal',                ARRAY['Drama','Sport'],                '/1CoKNi3XVyijPCvy0usDbSWEXAg.jpg', NOW() - INTERVAL '34 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 354912, 'Coco',                  ARRAY['Animation','Family','Musical'], '/6Ryitt95xrO8KXuqRGm1fUuNwqF.jpg', NOW() - INTERVAL '26 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 313369, 'La La Land',            ARRAY['Romance','Musical'],            '/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg', NOW() - INTERVAL '18 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 194,    'Amélie',                ARRAY['Romance','Comedy'],             '/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg', NOW() - INTERVAL '12 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 508442, 'Soul',                  ARRAY['Animation','Comedy','Fantasy'], '/6jmppcaubzLF8wkXM36ganVISCo.jpg', NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 316029, 'The Greatest Showman',  ARRAY['Musical','Drama'],              '/b9CeobiihCx1uG1tpw8hXmpi7nm.jpg', NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 579974, 'RRR',              ARRAY['Action','Drama'],   '/u0XUBNQWlOvrh0Gd97ARGpIkL0.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 346698, 'Barbie',            ARRAY['Comedy','Fantasy'], '/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_maya'), 637,    'Life Is Beautiful', ARRAY['Comedy','Drama'],   '/6tEJnof1DKWPnl5lzkjf0FVv7oB.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Rohan D'Souza — Horror, Slasher, Dark
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 138843, 'The Conjuring',  ARRAY['Horror','Thriller'], '/wVYREutTvI2tmxr6ujrHT704wGF.jpg', NOW() - INTERVAL '39 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 493922, 'Hereditary',     ARRAY['Horror','Drama'],    '/hjlZSXM86wJrfCv5VKfR5DI2VeU.jpg', NOW() - INTERVAL '31 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 447332, 'A Quiet Place',  ARRAY['Horror','Sci-Fi'],   '/nAU74GmpUk7t5iklEp3bufwDq4n.jpg', NOW() - INTERVAL '24 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 346364, 'It',             ARRAY['Horror'],            '/9E2y5Q7WlCVNEhP5GiVTjhEhx1o.jpg', NOW() - INTERVAL '17 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 694,    'The Shining',    ARRAY['Horror','Thriller'], '/uAR0AWqhQL1hQa69UDEbb2rE5Wx.jpg', NOW() - INTERVAL '11 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 4232,   'Scream',         ARRAY['Horror','Slasher'],  '/lr9ZIrmuwVmZhpZuTCW8D9g0ZJe.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 419430, 'Get Out',        ARRAY['Horror','Thriller'], '/mE24wUCfjK8AoBBjaMjho7Rczr7.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 882598, 'Smile',           ARRAY['Horror','Thriller'], '/aPqcQwu4VGEewPhagWNncDbJ9Xp.jpg', NOW() - INTERVAL '4 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 756999, 'The Black Phone', ARRAY['Horror','Thriller'], '/p9ZUzCyy9wRTDuuQexkQ78R2BgF.jpg', NOW() - INTERVAL '2 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_rohan'), 913290, 'Barbarian',       ARRAY['Horror','Thriller'], '/idT5mnqPcJgSkvpDX7pJffBzdVH.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Chloe Bennett — Aesthetic, Indie, Slow Cinema
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 120467, 'The Grand Budapest Hotel', ARRAY['Comedy','Drama'],         '/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg', NOW() - INTERVAL '37 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 376867, 'Moonlight',               ARRAY['Drama'],                  '/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg', NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 152601, 'Her',                     ARRAY['Romance','Sci-Fi','Drama'],'/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg', NOW() - INTERVAL '23 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 153,    'Lost in Translation',     ARRAY['Drama','Comedy'],          '/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg', NOW() - INTERVAL '16 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 391713, 'Lady Bird',               ARRAY['Drama','Comedy'],          '/gl66K7zRdtNYGrxyS2YDUP5ASZd.jpg', NOW() - INTERVAL '10 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 394117, 'The Florida Project',     ARRAY['Drama'],                   '/5QnDxdJg1fi6uMSkSi4x8tHsltm.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 194,    'Amélie',                  ARRAY['Romance','Comedy'],        '/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg', NOW() - INTERVAL '2 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 531428, 'Portrait of a Lady on Fire', ARRAY['Drama','Romance'],  '/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg', NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 965150, 'Aftersun',                   ARRAY['Drama'],            '/evKz85EKouVbIr51zy5fOtpNRPg.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_chloe'), 666277, 'Past Lives',                 ARRAY['Romance','Drama'],  '/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Yusuf Khan — Crime, Noir, Action (gangster antiheroes)
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 238,    'The Godfather',          ARRAY['Crime','Drama'],             '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', NOW() - INTERVAL '46 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 680,    'Pulp Fiction',           ARRAY['Crime','Thriller'],          '/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg', NOW() - INTERVAL '38 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 155,    'The Dark Knight',        ARRAY['Action','Crime','Thriller'], '/qJ2tW6WMUDux911r6m7haRef0WH.jpg', NOW() - INTERVAL '30 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 6977,   'No Country for Old Men', ARRAY['Crime','Thriller'],          '/6d5XOczc226jECq0LIX0siKtgHR.jpg', NOW() - INTERVAL '22 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 769,    'GoodFellas',             ARRAY['Crime','Drama'],             '/9OkCLM73MIU2CrKZbqiT8Ln1wY2.jpg', NOW() - INTERVAL '15 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 949,    'Heat',                   ARRAY['Crime','Action','Thriller'], '/e09dLw1Ljtccd2P4NsuUvVtS5du.jpg', NOW() - INTERVAL '8 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 64690,  'Drive',                  ARRAY['Crime','Drama','Action'],    '/602vevIURmpDfzbnv5Ubi6wIkQm.jpg', NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 273481, 'Sicario',                ARRAY['Crime','Thriller','Action'], '/lz8vNyXeidqqOdJW9ZjnDAMb5Vr.jpg', NOW() - INTERVAL '5 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 524,    'Casino',                 ARRAY['Crime','Drama'],             '/gziIkUSnYuj9ChCi8qOu2ZunpSC.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_yusuf'), 49026,  'The Dark Knight Rises',  ARRAY['Action','Crime','Thriller'], '/hr0L2aueqlP2BYUblTTjmtn0hw4.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────
-- Elena Rossi — Foreign Cinema, Drama, Art House
-- ─────────────────────────────────────────────────────────────────────
INSERT INTO watched_movies (user_id, tmdb_id, movie_title, movie_genre, poster_path, watched_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 11216,  'Cinema Paradiso',   ARRAY['Drama','Romance'],      '/gCI2AeMV4IHSewhJkzsur5MEp6R.jpg', NOW() - INTERVAL '48 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 496243, 'Parasite',          ARRAY['Thriller','Drama'],     '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg', NOW() - INTERVAL '39 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 129,    'Spirited Away',     ARRAY['Animation','Fantasy'],  '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', NOW() - INTERVAL '31 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 1417,   'Pan''s Labyrinth',  ARRAY['Fantasy','Drama','War'],'/z7xXihu5wHuSMWymq5VAulPVuvg.jpg', NOW() - INTERVAL '23 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 637,    'Life Is Beautiful', ARRAY['Comedy','Drama'],       '/6tEJnof1DKWPnl5lzkjf0FVv7oB.jpg', NOW() - INTERVAL '16 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 426426, 'Roma',              ARRAY['Drama'],                '/dtIIyQyALk57ko5bjac7hi01YQ.jpg', NOW() - INTERVAL '9 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 194,    'Amélie',            ARRAY['Romance','Comedy'],     '/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg', NOW() - INTERVAL '3 days')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;

INSERT INTO watchlist (user_id, tmdb_id, movie_title, movie_genre, poster_path, added_at) VALUES
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 290098, 'The Handmaiden',            ARRAY['Thriller','Drama','Romance'], '/dLlH4aNHdnmf62umnInL8xPlPzw.jpg', NOW() - INTERVAL '6 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 843,    'In the Mood for Love',      ARRAY['Drama','Romance'],            '/iYypPT4bhqXfq1b6EnmxvRt6b2Y.jpg', NOW() - INTERVAL '3 days'),
  ((SELECT id FROM users WHERE google_id = 'cinemate_elena'), 531428, 'Portrait of a Lady on Fire', ARRAY['Drama','Romance'],           '/2LquGwEhbg3soxSCs9VNyh5VJd9.jpg', NOW() - INTERVAL '1 day')
ON CONFLICT (user_id, tmdb_id) DO NOTHING;
