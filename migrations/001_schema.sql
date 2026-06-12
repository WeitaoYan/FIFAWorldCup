-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE DEFAULT '',
  password_hash TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  avatar_url TEXT DEFAULT '',
  role TEXT DEFAULT 'user',
  updated_at TEXT DEFAULT (datetime('now')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- Matches
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TEXT NOT NULL,
  stage TEXT NOT NULL,
  group_name TEXT DEFAULT '',
  venue TEXT DEFAULT '',
  status TEXT DEFAULT 'scheduled',
  home_score INTEGER,
  away_score INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Standings
CREATE TABLE IF NOT EXISTS standings (
  id TEXT PRIMARY KEY,
  team_name TEXT NOT NULL,
  group_name TEXT NOT NULL,
  played INTEGER DEFAULT 0,
  won INTEGER DEFAULT 0,
  drawn INTEGER DEFAULT 0,
  lost INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_diff INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  UNIQUE(team_name, group_name)
);

-- Predictions
CREATE TABLE IF NOT EXISTS predictions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  match_id TEXT NOT NULL,
  home_pred INTEGER NOT NULL,
  away_pred INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (match_id) REFERENCES matches(id),
  UNIQUE(user_id, match_id)
);

-- Chat rooms
CREATE TABLE IF NOT EXISTS chat_rooms (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

-- Chat messages
CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  room_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Match comments
CREATE TABLE IF NOT EXISTS match_comments (
  id TEXT PRIMARY KEY,
  match_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (match_id) REFERENCES matches(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Achievement definitions
CREATE TABLE IF NOT EXISTS achievement_defs (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT '',
  criteria TEXT NOT NULL DEFAULT '{}'
);

-- User achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (achievement_id) REFERENCES achievement_defs(id),
  UNIQUE(user_id, achievement_id)
);

-- Streaks for prediction bonuses
CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Team translations (multi-language)
CREATE TABLE IF NOT EXISTS team_translations (
  team_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (team_id, locale)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_matches_date ON matches(match_date);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_predictions_user ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_room ON chat_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_standings_group ON standings(group_name);
CREATE INDEX IF NOT EXISTS idx_standings_points ON standings(points DESC);
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);

-- Default achievement definitions
INSERT OR IGNORE INTO achievement_defs (id, key, name, description, criteria) VALUES
  ('a1', 'welcome', '初来乍到', '注册账号即可获得', '{"type":"register"}'),
  ('a2', 'first_correct', '首次猜中', '第一次猜中比赛比分', '{"type":"correct_prediction","count":1}'),
  ('a3', 'streak_5', '五连中', '连续猜中5场比赛', '{"type":"streak","count":5}'),
  ('a4', 'streak_10', '十连胜', '连续猜中10场比赛', '{"type":"streak","count":10}'),
  ('a5', 'prediction_50', '竞猜达人', '累计竞猜50场比赛', '{"type":"predictions","count":50}'),
  ('a6', 'perfect_group', '小组全对', '某小组所有比赛全部猜对', '{"type":"perfect_group"}'),
  ('a7', 'chatty', '水群达人', '在聊天室发言100条', '{"type":"messages","count":100}'),
  ('a8', 'social_butterfly', '社交达人', '加入5个不同群组', '{"type":"rooms","count":5}'),
  ('a9', 'top10', '顶尖高手', '积分榜进入前10', '{"type":"rank","position":10}'),
  ('a10', 'early_bird', '早起鸟', '10次提前24小时竞猜', '{"type":"early_predictions","count":10}'),
  ('a11', 'knockout_master', '淘汰赛专家', '淘汰赛阶段全部猜对', '{"type":"knockout_perfect"}'),
  ('a12', 'champion_predict', '冠军预言', '决赛前猜中最终冠军', '{"type":"champion"}');
