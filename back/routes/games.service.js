const db = require('../database/db')

const getGradeStatistics = async (year) => {
    const startDate = `${String(year).padStart(4, '0')}-01-01`
    const endDate = `${String(year + 1).padStart(4, '0')}-01-01`
    const rows = db.prepare(`
        WITH grade_totals AS (
            SELECT m.grade, SUM(g.score) AS totalScore, COUNT(*) AS gameCount
            FROM games g
            JOIN members m ON m.id = g.memberId
            WHERE m.grade IN (1, 2)
              AND m.id < 10000
              AND g.date >= @startDate AND g.date < @endDate
            GROUP BY m.grade
        ), requested_grades(grade) AS (VALUES (1), (2))
        SELECT r.grade,
               COALESCE(t.totalScore, 0) AS totalScore,
               COALESCE(t.gameCount, 0) AS gameCount,
               ROUND(t.totalScore * 1.0 / NULLIF(t.gameCount, 0), 2) AS averageScore
        FROM requested_grades r
        LEFT JOIN grade_totals t ON t.grade = r.grade
        UNION ALL
        SELECT NULL AS grade,
               COALESCE(SUM(totalScore), 0) AS totalScore,
               COALESCE(SUM(gameCount), 0) AS gameCount,
               ROUND(SUM(totalScore) * 1.0 / NULLIF(SUM(gameCount), 0), 2) AS averageScore
        FROM grade_totals
        ORDER BY grade
    `).all({ startDate, endDate })
    const { totalScore, gameCount, averageScore } = rows.find(row => row.grade === null)
    return {
        year,
        grades: rows.filter(row => row.grade !== null),
        combined: { totalScore, gameCount, averageScore }
    }
}

const getMemberGames = async (memberId, startDate, endDate) => {
    return db.prepare(`
        SELECT
            g.id AS id,
            g.date AS date,
            g.center AS center,
            g.score AS score,
            ROW_NUMBER() OVER (
                PARTITION BY DATE(g.date)
                ORDER BY g.id
            ) AS sequence,
            CASE
                WHEN g.eventId IS NULL THEN 'personal'
                ELSE 'regular'
            END AS type,
            g.eventId AS eventId
        FROM games g
        WHERE g.memberId = :memberId
          AND g.date >= :startDate
          AND g.date < DATE(:endDate, '+1 day')
        ORDER BY DATE(g.date), g.id
    `).all({ memberId, startDate, endDate })
}

const savePersonalGames = ({ memberId, date, center, scores }) => db.transaction(() => {
    if (!db.prepare('SELECT 1 FROM members WHERE id = ?').get(memberId)) {
        throw Object.assign(new Error('해당 회원을 찾을 수 없습니다.'), { status: 400 })
    }

    const insert = db.prepare(`
        INSERT INTO games (eventId, memberId, gameNumber, date, score, center)
        VALUES (NULL, @memberId, @gameNumber, @date, @score, @center)
    `)
    const insertedIds = new Set(scores.map(({ gameNumber, score }) =>
        insert.run({ memberId, date, gameNumber, score, center }).lastInsertRowid))

    // Rank the whole day before selecting new rows so sequence matches the GET API.
    return db.prepare(`
        SELECT id, date, center, score,
               ROW_NUMBER() OVER (ORDER BY id) AS sequence,
               CASE WHEN eventId IS NULL THEN 'personal' ELSE 'regular' END AS type,
               eventId
        FROM games
        WHERE memberId = @memberId AND DATE(date) = @date
        ORDER BY id
    `).all({ memberId, date }).filter(game => insertedIds.has(game.id))
}).immediate()

// Called synchronously inside the event transaction.
const saveGames = ({ eventId, memberId, scores }, date, center) => {
    const insert = db.prepare(`
        INSERT INTO games (eventId, memberId, gameNumber, date, score, center)
        VALUES (@eventId, @memberId, @gameNumber, @date, @score, @center)
    `)
    return scores.map(({ gameNumber, score }) => insert.run({ eventId, memberId, gameNumber, date, score, center }))
}

const eventRecords = (eventId) => {
    const rows = db.prepare(`
        SELECT g.id, g.eventId, g.memberId, m.name, g.gameNumber, g.score
        FROM games g
        LEFT JOIN members m ON m.id = g.memberId
        WHERE g.eventId = ?
        ORDER BY g.id
    `).all(eventId)
    const members = new Map()
    for (const game of rows) {
        if (!members.has(game.memberId)) {
            members.set(game.memberId, {
                eventId: game.eventId, memberId: game.memberId, name: game.name,
                game1: null, game2: null, game3: null, game4: null,
                totalScore: 0, gameCount: 0, average: null
            })
        }
        const record = members.get(game.memberId)
        record[`game${game.gameNumber}`] = game.score
        record.totalScore += game.score
        record.gameCount++
    }
    return [...members.values()].map(record => ({ ...record, average: record.totalScore / record.gameCount }))
}

const deleteGameByEventId = (eventId) => db.prepare('DELETE FROM games WHERE eventId = ?').run(eventId)

module.exports = { savePersonalGames, getGradeStatistics, getMemberGames, saveGames, eventRecords, deleteGameByEventId }
