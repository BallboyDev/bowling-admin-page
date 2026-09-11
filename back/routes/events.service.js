const db = require('../database/db')

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
            select eventId, title, date, eventType, pattern, player, image, lotto
                from events where eventId = ?
        `
        const result = db.prepare(query).get(eventId)

        return result
    } catch (err) {
        throw err
    }
}

const deleteEvent = async (eventId) => {
    try {
        const query = `
            delete from events
                where eventId = ?
        `

        const result = db.prepare(query).run(eventId)

        return result
    } catch (err) {
        throw err
    }

}

const saveEvent = async (title, date, mainevent, records, pattern, lotto) => {
    try {
        const ids = db.prepare(`select distinct eventId from events where date = ?`).all(date)

        const eventId = `${date}_${ids.length}`

        const query = `
            insert into events (eventId, title, date, eventType, pattern, player, image, lotto)
            values ( ?, ?, ?, ?, ?, ?, ?, ?)
        `

        const result = db.prepare(query).run(
            eventId,
            title,
            date,
            mainevent ? 1 : 0,
            pattern,
            records.length,
            'image',
            lotto
        )

        return eventId
    } catch (err) {
        throw err
    }
}

module.exports = {
    eventList,
    eventInfo,
    saveEvent,
    deleteEvent
}