const db = require('../db');
const membersDump = require('./members.dump.json')
const recordsDump = require('./records.dump.json')

const env = process.env.NODE_ENV

const initMembers = () => {
    const initMember = db.prepare(`insert into members (auth, name, phone, style, birth) values (?, ?, ?, ?, ?)`)
    membersDump.map((v) => {
        const result = initMember.run(v.auth, v.name, v.phone, v.style, v.birth)
        console.log(result)
    })
}
const initRecords = () => {
    const initRecord = db.prepare(`
        insert into records (eventId, memberId, game1, game2, game3, game4, totalScore, gameCount, average)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    recordsDump.map((v) => {
        // const m = db.prepare('select id from members where name = ?').get(v.name)

        // console.log(m)

        const result = initRecord.run(v.eventId, v.memberId, v.game1, v.game2, v.game3, v.game4, v.totalScore, v.gameCount, v.average)

        console.log(result)
    })
}

// "init": "node ./database/dump/initData.js"
const init = () => {
    if (!env || env === 'member') {
        initMembers()
    }
    if (!env || env === 'record') {
        initRecords()
    }


}

init()