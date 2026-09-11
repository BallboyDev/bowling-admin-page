const db = require('../database/db')

const saveGames = async (gameData, date) => {
    try {
        const { eventId, recordId, memberId, scores } = gameData

        const result = []

        scores.forEach((score) => {
            if (!!score) {
                const query = `
                insert into games (eventId, recordId, memberId, date, score)
                    values (?, ?, ?, ?, ?)
            `

                const gameResult = db.prepare(query).run(
                    eventId, recordId, memberId, date, score
                )

                result.push(gameResult)
            }
        })

        return result
    } catch (err) {
        throw err
    }
}

const deleteGameByEventId = async (eventId) => {
    try {
        const query = `
            delete from games
                where eventId = ?
        `

        const result = db.prepare(query).run(eventId)

        return result
    } catch (err) {
        throw err
    }
}

module.exports = {
    saveGames,
    deleteGameByEventId
}