const db = require('../database/db')
const gamesService = require('./games.service')
const { badRequest, validateEventInput } = require('./events.validation')

const eventList = async () => {
    try {
        const query = `
            select ROW_NUMBER() OVER ( ORDER BY eventId ) pos, 
                    title, 
                    eventId
                from events
        `

        const result = db.prepare(query).all()
        return result
    } catch (err) {
        throw err
    }
}

const eventInfo = async (eventId) => {
    try {
        const query = `
            select eventId, title, date, eventType, pattern, player, image, lotto, center
                from events where eventId = ?
        `
        const result = db.prepare(query).get(eventId)

        return result
    } catch (err) {
        throw err
    }
}

const deleteEvent = (eventId) => db.transaction(() => {
    if (!db.prepare('SELECT 1 FROM events WHERE eventId = ?').get(eventId)) return null
    const participantCount = db.prepare('SELECT COUNT(DISTINCT memberId) n FROM games WHERE eventId = ?').get(eventId).n
    const gameResult = gamesService.deleteGameByEventId(eventId)
    const eventResult = db.prepare('DELETE FROM events WHERE eventId = ?').run(eventId)
    // Retain the response envelope for existing callers; no records table is involved.
    return { eventResult, recordResult: { changes: participantCount }, gameResult }
}).immediate()

const saveEvent = (input) => {
    const data = validateEventInput(input)
    return db.transaction(() => {
        const seen = new Set()
        const participants = data.participants.map(participant => {
            const candidates = participant.memberId !== undefined
                ? db.prepare('SELECT id FROM members WHERE id = ?').all(participant.memberId)
                : db.prepare('SELECT id FROM members WHERE name = ?').all(participant.name.trim())
            if (candidates.length !== 1) throw badRequest('회원을 찾을 수 없거나 이름이 중복됩니다. memberId로 회원을 지정해 주세요.')
            const memberId = candidates[0].id
            if (seen.has(memberId)) throw badRequest('동일한 회원의 기록이 중복되었습니다.')
            seen.add(memberId)
            return { memberId, scores: participant.scores }
        })
        // Check the identifier itself; dates can change and deleted suffixes can leave gaps.
        const exists = db.prepare('SELECT 1 FROM events WHERE eventId = ?')
        let suffix = 0
        while (exists.get(`${data.date}_${suffix}`)) suffix++
        const eventId = `${data.date}_${suffix}`
        db.prepare(`
            INSERT INTO events (eventId, title, date, eventType, pattern, player, image, lotto, center)
            VALUES (@eventId, @title, @date, @eventType, @pattern, @player, 'image', @lotto, @center)
        `).run({ eventId, title: data.title, date: data.date, eventType: data.eventType,
            pattern: data.pattern, player: participants.length, lotto: data.lotto, center: data.center })
        const recordResult = []
        const gameResult = []
        for (const participant of participants) {
            gameResult.push(...gamesService.saveGames({ eventId, ...participant }, data.date, data.center))
            recordResult.push({ eventId, memberId: participant.memberId,
                scores: participant.scores.map(game => game.score) })
        }
        return { eventId, recordResult, gameResult }
    }).immediate()
}

const modifyEvent = async ({ eventId, title, date, eventType, pattern, center }) => {
    // Keep this transaction synchronous so both updates commit or roll back together.
    return db.transaction(() => {
        const result = db.prepare(`
            UPDATE events
            SET title = @title,
                date = @date,
                eventType = @eventType,
                pattern = @pattern,
                center = @center
            WHERE eventId = @eventId
        `).run({ eventId, title, date, eventType, pattern, center })

        if (result.changes === 0) {
            return null
        }

        // Defend against an unexpected schema without the unique event identifier index.
        if (result.changes !== 1) {
            throw new Error('eventId에 해당하는 이벤트가 여러 개입니다.')
        }

        db.prepare(`
            UPDATE games
            SET center = @center,
                date = @date
            WHERE eventId = @eventId
        `).run({ eventId, center, date })

        return db.prepare(`
            SELECT eventId, title, date, eventType, pattern, player, image, lotto, center
            FROM events
            WHERE eventId = ?
        `).get(eventId)
    })()
}

module.exports = {
    eventList,
    eventInfo,
    saveEvent,
    deleteEvent,
    modifyEvent
}