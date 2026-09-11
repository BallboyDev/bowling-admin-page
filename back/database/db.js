const db = require('better-sqlite3')('database/app.db');

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');



// auth : 0 관리자 / 1 운영진 / 2 일반회원 / 3 게스트, 용병
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    auth NUMBERIC NOT NULL DEFAULT 2,
    name TEXT NOT NULL,
    phone NUMERIC NOT NULL,
    handicap NUMBERIC default 0,
    style TEXT,
    birth TEXT DEFAULT CURRENT_TIMESTAMP,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  create table if not exists events (
    id integer primary key autoincrement,
    eventId text not null,
    title text not null,
    date text not null,
    eventType boolean default true,
    pattern text,
    player number,
    image text not null,
    created_at text not null default current_timestamp
  )
`)

db.exec(`
  create table if not exists records (
    id integer primary key autoincrement,
    eventId text not null,
    memberId numberic not null,
    game1 numberic,
    game2 numberic,
    game3 numberic,
    game4 numberic,
    totalScore numberic,
    gameCount numberic,
    average numberic,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  create table if not exists games (
    id integer primary key autoincrement,
    eventId text,
    recordId numberic,
    memberId numberic not null,
    date text not null,
    score numberic not null,
    center text,
    records numberic default 0,
    created_at text not null default current_timestamp
  )
`)

// export default db;
module.exports = db;

