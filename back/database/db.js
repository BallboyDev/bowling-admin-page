const db = require('better-sqlite3')('database/app.db');

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');


// create memberList TABLE
// auth : 0 관리자 / 1 운영진 / 2 일반회원 / 3 게스트, 용병
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth NUMBERIC NOT NULL DEFAULT 2,
    name TEXT NOT NULL,
    phone NUMERIC NOT NULL,
    style TEXT,
    birth TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  create table if not exists records (
    id integer primary key autoincrement,
    title_id text not null,
    member_id numberic not null,
    title text not null,
    date text not null,
    name text not null,
    game1 numberic,
    game2 numberic,
    game3 numberic,
    game4 numberic,
    total_score numberic,
    game_count numberic,
    average numberic,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

// export default db;
module.exports = db;

