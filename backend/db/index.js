const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data.sqlite');
const rawDb = new DatabaseSync(DB_PATH);

rawDb.exec('PRAGMA journal_mode = WAL');
rawDb.exec('PRAGMA foreign_keys = ON');

const db = {
  exec: (sql) => rawDb.exec(sql),
  prepare: (sql) => rawDb.prepare(sql),
};

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  bio TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  role TEXT NOT NULL DEFAULT 'user',
  is_banned INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS ratings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_key TEXT NOT NULL,
  content_title TEXT,
  content_poster TEXT,
  content_type TEXT,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, content_key)
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_key TEXT NOT NULL,
  content_title TEXT,
  content_type TEXT,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_removed INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chat_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  content_key TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS room_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS dm_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS library (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_key TEXT NOT NULL,
  content_title TEXT,
  content_poster TEXT,
  content_type TEXT,
  status TEXT NOT NULL DEFAULT 'watched',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, content_key)
);

CREATE INDEX IF NOT EXISTS idx_ratings_content ON ratings(content_key);
CREATE INDEX IF NOT EXISTS idx_comments_content ON comments(content_key);
CREATE INDEX IF NOT EXISTS idx_room_messages_room ON room_messages(room_id);
CREATE INDEX IF NOT EXISTS idx_dm_pair ON dm_messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_library_user ON library(user_id);
CREATE INDEX IF NOT EXISTS idx_library_status ON library(user_id, status);
`);

const generalRoom = db.prepare(`SELECT * FROM chat_rooms WHERE name = 'Genel Sohbet'`).get();
if (!generalRoom) {
  db.prepare(`INSERT INTO chat_rooms (name, content_key) VALUES ('Genel Sohbet', NULL)`).run();
}

function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@cinemaai.local';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existing = db.prepare(`SELECT * FROM users WHERE email = ?`).get(email);
  if (!existing) {
    const hash = bcrypt.hashSync(password, 10);
    db.prepare(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, 'admin')`
    ).run(username, email, hash);
    console.log(`Yonetici hesabi olusturuldu -> email: ${email} / sifre: ${password}`);
  }
}
ensureAdmin();

module.exports = db;
