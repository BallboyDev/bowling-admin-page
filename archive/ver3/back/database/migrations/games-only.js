const assert = require('node:assert/strict')
const path = require('node:path')
const Database = require('better-sqlite3')
const { gamesTableSql, createIndexes } = require('../schema')

const migrate = (db) => db.transaction(() => {
    const hasRecords = db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'records'").get()
    if (!hasRecords) {
        const columns = db.pragma('table_info(games)').map(column => column.name)
        assert(columns.includes('gameNumber') && !columns.includes('recordId') && !columns.includes('records'), 'Unknown games schema')
        createIndexes(db)
        return { alreadyMigrated: true }
    }
    const beforeGames = db.prepare('SELECT * FROM games ORDER BY id').all()
    const beforeEvents = db.prepare('SELECT * FROM events ORDER BY id').all()
    const beforeMembers = db.prepare('SELECT * FROM members ORDER BY id').all()
    const records = db.prepare('SELECT * FROM records ORDER BY id').all()
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok')
    assert.equal(db.prepare('SELECT COUNT(*) n FROM (SELECT eventId FROM events GROUP BY eventId HAVING COUNT(*) > 1)').get().n, 0, 'Duplicate eventId')
    assert.equal(db.prepare('SELECT COUNT(*) n FROM (SELECT eventId, memberId FROM records GROUP BY eventId, memberId HAVING COUNT(*) > 1)').get().n, 0, 'Duplicate attendance record')
    const allowedColumns = ['id', 'eventId', 'recordId', 'memberId', 'date', 'score', 'center', 'records', 'created_at']
    assert(db.pragma('table_info(games)').every(column => allowedColumns.includes(column.name)), 'Unexpected games columns; manual review required')
    assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE tbl_name IN ('games', 'records') AND type IN ('index', 'trigger') AND sql IS NOT NULL").get().n, 0, 'Custom indexes/triggers require review')
    assert.equal(db.prepare("SELECT COUNT(*) n FROM sqlite_master WHERE type = 'view' AND (lower(sql) LIKE '%records%' OR lower(sql) LIKE '%games%')").get().n, 0, 'Dependent views require review')
    const eventIds = new Set(beforeEvents.map(event => event.eventId))
    const memberIds = new Set(beforeMembers.map(member => member.id))
    const groups = new Map()
    for (const game of beforeGames) {
        assert(Number.isInteger(game.score) && game.score >= 0 && game.score <= 300, `Invalid score: game ${game.id}`)
        assert(memberIds.has(game.memberId), `Missing member: game ${game.id}`)
        assert(game.eventId === null || eventIds.has(game.eventId), `Missing event: game ${game.id}`)
        assert(game.records === 0 || game.records === null, `Nonempty legacy records flag: game ${game.id}`)
        if (game.recordId !== null) {
            if (!groups.has(game.recordId)) groups.set(game.recordId, [])
            groups.get(game.recordId).push(game)
        } else {
            assert.equal(game.eventId, null, `Event game without recordId: ${game.id}`)
        }
    }
    const gameNumbers = new Map()
    let skippedSlots = 0
    for (const record of records) {
        assert(eventIds.has(record.eventId) && memberIds.has(record.memberId), `Orphan record: ${record.id}`)
        const slots = Object.keys(record).filter(key => /^game[1-9][0-9]*$/.test(key))
            .sort((a, b) => Number(a.slice(4)) - Number(b.slice(4)))
            .filter(key => record[key] !== null)
        const games = groups.get(record.id) || []
        assert(slots.length > 0, `Record without games: ${record.id}`)
        assert.equal(games.length, slots.length, `Game count mismatch: record ${record.id}`)
        assert.equal(record.gameCount, slots.length, `Stored count mismatch: record ${record.id}`)
        const total = slots.reduce((sum, key) => sum + record[key], 0)
        assert.equal(record.totalScore, total, `Total mismatch: record ${record.id}`)
        assert(Math.abs(record.average - total / slots.length) < 1e-8, `Average mismatch: record ${record.id}`)
        if (slots.some((key, i) => Number(key.slice(4)) !== i + 1)) skippedSlots++
        slots.forEach((key, index) => {
            const game = games[index]
            assert.equal(game.eventId, record.eventId, `Event mismatch: game ${game.id}`)
            assert.equal(game.memberId, record.memberId, `Member mismatch: game ${game.id}`)
            assert.equal(game.score, record[key], `Score order mismatch: game ${game.id}`)
            gameNumbers.set(game.id, Number(key.slice(4)))
        })
        groups.delete(record.id)
    }
    assert.equal(groups.size, 0, 'Games reference missing records')
    const previousSequence = db.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'games'").get()?.seq || 0
    db.exec(gamesTableSql('games_migration'))
    const insert = db.prepare(`INSERT INTO games_migration
        (id, eventId, memberId, gameNumber, date, score, center, created_at)
        VALUES (@id, @eventId, @memberId, @gameNumber, @date, @score, @center, @created_at)`)
    for (const game of beforeGames) {
        insert.run({ id: game.id, eventId: game.eventId, memberId: game.memberId,
            gameNumber: gameNumbers.get(game.id) ?? null, date: game.date,
            score: game.score, center: game.center, created_at: game.created_at })
    }
    // Validation and replacement are in the same transaction; any failure restores the legacy schema.
    db.exec('DROP TABLE games; ALTER TABLE games_migration RENAME TO games; DROP TABLE records;')
    const sequence = db.prepare("SELECT seq FROM sqlite_sequence WHERE name = 'games'").get()
    if (!sequence) db.prepare("INSERT INTO sqlite_sequence(name, seq) VALUES ('games', ?)").run(previousSequence)
    else db.prepare("UPDATE sqlite_sequence SET seq = MAX(seq, ?) WHERE name = 'games'").run(previousSequence)
    createIndexes(db)
    const columns = ['id', 'eventId', 'memberId', 'date', 'score', 'center', 'created_at']
    const preserved = beforeGames.map(game => Object.fromEntries(columns.map(key => [key, game[key]])))
    assert.deepEqual(db.prepare(`SELECT ${columns.join(', ')} FROM games ORDER BY id`).all(), preserved)
    assert.deepEqual(db.prepare('SELECT * FROM events ORDER BY id').all(), beforeEvents)
    assert.deepEqual(db.prepare('SELECT * FROM members ORDER BY id').all(), beforeMembers)
    assert.equal(db.pragma('integrity_check', { simple: true }), 'ok')
    assert.equal(db.pragma('foreign_key_check').length, 0)
    return { events: beforeEvents.length, recordsRemoved: records.length, gamesPreserved: beforeGames.length, skippedSlotRecords: skippedSlots }
}).immediate()

if (require.main === module) {
    const filename = process.argv[2]
    if (!filename) {
        console.error('Usage: node database/migrations/games-only.js <DB path> (stop the server first)')
        process.exitCode = 1
    } else {
        const db = new Database(path.resolve(filename), { fileMustExist: true })
        db.pragma('busy_timeout = 5000')
        const backup = `${path.resolve(filename)}.before-games-only-${Date.now()}.bak`
        db.backup(backup).then(() => {
            console.log(JSON.stringify({ backup, result: migrate(db) }))
        }).catch(error => {
            console.error(error.message)
            process.exitCode = 1
        }).finally(() => db.close())
    }
}

module.exports = { migrate }
