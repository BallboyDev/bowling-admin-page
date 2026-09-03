const db = require('../database/db')

const saveGames = async (gameData, date) => {
    try {
        const { recordId, memberId, scores } = gameData

        const result = []

        scores.forEach((score) => {
            if (!!score) {
                const query = `
                insert into games (recordId, memberId, date, score)
                    values (?, ?, ?, ?)
            `

                const gameResult = db.prepare(query).run(
                    recordId, memberId, date, score
                )

                result.push(gameResult)
            }
        })

        return result
    } catch (err) {
        throw err
    }
}

module.exports = {
    saveGames
}