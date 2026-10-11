-- ============================================================
-- seed.sql – נתוני דוגמה לפיתוח
-- סיסמה לכולם: password123
-- ============================================================
USE tripdiary;

INSERT INTO users (username, name, email, phone, website, is_admin) VALUES
  ('alice',   'Alice Cohen',   'alice@example.com',   '050-1111111', 'alice.dev',  FALSE),
  ('bob',     'Bob Levi',      'bob@example.com',     '052-2222222', 'boblevi.io', FALSE),
  ('charlie', 'Charlie Mizra', 'charlie@example.com', '054-3333333', NULL,         FALSE),
  ('admin',   'Site Admin',    'admin@tripdiary.com',  NULL,          NULL,         TRUE);

-- bcrypt hash של "password123" (cost 10)
INSERT INTO credentials (user_id, password_hash) VALUES
  (1, '$2b$10$7Qv3e0Zk5Y1Xk6Ld9Hq7uOeHm2KpVfBnRsJgW4tCiNoDyAEwMlXS'),
  (2, '$2b$10$7Qv3e0Zk5Y1Xk6Ld9Hq7uOeHm2KpVfBnRsJgW4tCiNoDyAEwMlXS'),
  (3, '$2b$10$7Qv3e0Zk5Y1Xk6Ld9Hq7uOeHm2KpVfBnRsJgW4tCiNoDyAEwMlXS'),
  (4, '$2b$10$7Qv3e0Zk5Y1Xk6Ld9Hq7uOeHm2KpVfBnRsJgW4tCiNoDyAEwMlXS');

INSERT INTO trips (user_id, title, destination, start_date, end_date, status) VALUES
  (1, 'Spring in Paris',     'Paris, France',  '2024-04-01', '2024-04-10', 'completed'),
  (1, 'Summer in Italy',     'Rome, Italy',    '2024-07-15', '2024-07-25', 'planned'),
  (1, 'Tokyo Adventure',     'Tokyo, Japan',   '2024-09-01', '2024-09-14', 'planned'),
  (2, 'Beach Holiday',       'Hawaii, USA',    '2024-06-01', '2024-06-08', 'completed'),
  (2, 'Alpine Trek',         'Swiss Alps',     '2024-08-10', '2024-08-20', 'ongoing'),
  (3, 'City Break',          'Barcelona',      '2024-05-05', '2024-05-09', 'completed');

INSERT INTO journal (user_id, title, body, location) VALUES
  (1, 'First day in Paris',   'Arrived at CDG airport and took the metro to our hotel...', 'Paris'),
  (1, 'Eiffel Tower visit',   'Woke up early to beat the crowds at the Eiffel Tower...', 'Champ de Mars'),
  (2, 'Sunrise at the beach', 'Nothing beats waking up to the sound of Hawaiian waves...', 'Waikiki Beach'),
  (3, 'La Sagrada Família',   'Gaudí''s masterpiece left me absolutely speechless...', 'Barcelona');

INSERT INTO memories (entry_id, name, email, body) VALUES
  (1, 'Bob Levi',    'bob@example.com',     'Sounds amazing Alice! I love Paris.'),
  (1, 'Charlie',     'charlie@example.com', 'I was there last year too!'),
  (2, 'Bob Levi',    'bob@example.com',     'Great photo spots there for sure.'),
  (3, 'Alice Cohen', 'alice@example.com',   'Hawaii is on my bucket list!'),
  (4, 'Bob Levi',    'bob@example.com',     'Gaudí was a genius.');
