const gamesTableSql = (table = 'games') => `
    CREATE TABLE ${table} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventId TEXT,
        memberId NUMERIC NOT NULL,
        gameNumber INTEGER CHECK (gameNumber IS NULL OR (typeof(gameNumber) = 'integer' AND gameNumber > 0)),
        date TEXT NOT NULL,
        score INTEGER NOT NULL CHECK (typeof(score) = 'integer' AND score BETWEEN 0 AND 300),
        center TEXT,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CHECK (eventId IS NULL OR gameNumber IS NOT NULL)
    )
`

const createIndexes = (db) => db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS events_eventId_unique ON events(eventId);
    CREATE UNIQUE INDEX IF NOT EXISTS games_event_member_number_unique
        ON games(eventId, memberId, gameNumber);
    CREATE INDEX IF NOT EXISTS games_member_date ON games(memberId, date);
`)

const initializeSchema = (db) => {
    if (db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'records'").get()) {
        throw new Error('기존 DB는 서버를 중지하고 npm run migrate:games -- <DB 경로>로 먼저 이관해야 합니다.')
    }
    db.transaction(() => {
        db.exec(`
            CREATE TABLE IF NOT EXISTS members (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                auth NUMBERIC NOT NULL DEFAULT 2,
                name TEXT NOT NULL,
                phone NUMERIC NOT NULL,
                handicap NUMBERIC DEFAULT 0,
                style TEXT,
                birth TEXT DEFAULT CURRENT_TIMESTAMP,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                grade INTEGER NOT NULL DEFAULT 0,
                password text not null default '0000'
            );
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                eventId TEXT NOT NULL,
                title TEXT NOT NULL,
                date TEXT NOT NULL,
                eventType BOOLEAN DEFAULT TRUE,
                pattern TEXT,
                player NUMBER,
                image TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                lotto TEXT,
                center TEXT
            );
        `)
        if (!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'games'").get()) {
            db.exec(gamesTableSql())
        }
        const columns = db.pragma('table_info(games)').map(column => column.name)
        if (!columns.includes('gameNumber') || columns.includes('recordId') || columns.includes('records')) {
            throw new Error('games 테이블 구조를 먼저 이관해야 합니다.')
        }
        createIndexes(db)
    })()
}

module.exports = { gamesTableSql, createIndexes, initializeSchema }
