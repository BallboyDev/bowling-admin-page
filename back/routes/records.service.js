const db = require('../database/db');

const records = async (req, res) => {
    return { message: "select * from records" }
}

const recordList = async (eventId) => {
    try {
        const query = `
            select g.eventId, 
                    r.memberId, 
                    m.name, 
                    r.game1, 
                    r.game2, 
                    r.game3, 
                    r.game4, 
                    r.totalScore,
                    r.gameCount,
                    r.average
                from records r
                    left outer join members m
                        on r.memberId = m.id
                    left outer join events g
                        on r.eventId = g.eventId
                where r.eventId = ?;
        `

        const result = db.prepare(query).all(eventId)
        return result
    } catch (err) {
        throw err
    }
}

const deleteRecordByEventId = async (eventId) => {
    try {
        const query = `
            delete from records
                where eventId = ?
        `
        const result = db.prepare(query).run(eventId)
        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}

const saveRecords = async (eventId, date, title, records, mainGame) => {
    // console.log(date, title, records, mainGame)

    try {
        const result = records.map((v) => {
            const totalScore = (v?.game1.score || 0) + (v?.game2.score || 0) + (v?.game3.score || 0) + (v?.game4.score || 0)
            const count = (!!v?.game1.score ? 1 : 0) + (!!v?.game2.score ? 1 : 0) + (!!v?.game3.score ? 1 : 0) + (!!v?.game4.score ? 1 : 0)
            const average = totalScore / count

            const { id } = db.prepare('select id from members where name = ?').get(v.name)

            const query = `
                insert into records (eventId, memberId, game1, game2, game3, game4, totalScore, gameCount, average)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `

            const saveResult = db.prepare(query).run(
                eventId,
                id,
                v.game1.score,
                v.game2.score,
                v.game3.score,
                v.game4.score,
                totalScore,
                count,
                average
            )

            return {
                eventId,
                recordId: saveResult.lastInsertRowid,
                memberId: id,
                scores: [v.game1.score, v.game2.score, v.game3.score, v.game4.score]

            }


        })

        return result
    } catch (err) {
        console.log(err)
        throw err
    }
}


module.exports = {
    records,
    recordList,
    saveRecords,
    deleteRecordByEventId
}
