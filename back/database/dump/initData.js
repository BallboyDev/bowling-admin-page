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
        insert into records (title_id, member_id, title, date, name, game1, game2, game3, game4, total_score, game_count, average)
            values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    recordsDump.map((v) => {
        const m = db.prepare('select id from members where name = ?').get(v.name)

        const result = initRecord.run(v.title_id, m?.id || 0, v.title, v.date, v.name, v.game1, v.game2, v.game3, v.game4, v.total_score, v.game_count, v.average)

        console.log(result)
    })
}

const init = () => {
    if (!env || env === 'member') {
        initMembers()
    }
    if (!env || env === 'record') {
        initRecords()
    }


}

init()