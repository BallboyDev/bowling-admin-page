const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert/strict')
const Database = require('better-sqlite3')
const express = require('express')
const { initializeSchema } = require('../database/schema')
const db = new Database(':memory:')
initializeSchema(db)
require.cache[require.resolve('../database/db')] = { exports: db }
// Unrelated external integrations are excluded; the actual index and target routers are loaded.
for (const route of ['openai.route', 'images.route']) {
    require.cache[require.resolve(`../routes/${route}`)] = { exports: express.Router() }
}
const service = require('../routes/events.service')
const games = require('../routes/games.service')
const members = require('../routes/members.service')
const router = express.Router()
router.use('/api', require('../routes'))
const input = (overrides = {}) => ({ title: 'Event', date: '2026-09-13', mainGame: true,
    pattern: 'Pattern', center: 'Center', lotto: null,
    records: [{ name: 'A', game1: { score: null }, game2: { score: 0 }, game5: { score: 200 } }], ...overrides })
const snapshot = () => JSON.stringify(['events', 'games'].map(table => db.prepare(`SELECT * FROM ${table} ORDER BY id`).all()))
function request(method, url, body) {
    return new Promise((resolve, reject) => {
        const query = Object.fromEntries(new URL(url, 'http://localhost').searchParams)
        const req = { method, url, headers: {}, body, query }
        const res = { code: 200, status(code) { this.code = code; return this }, json(body) { resolve({ code: this.code, body }); return this } }
        router.handle(req, res, error => error ? reject(error) : resolve({ code: 404 }))
    })
}
beforeEach(() => {
    db.exec('DROP TRIGGER IF EXISTS fail_write; DELETE FROM games; DELETE FROM events; DELETE FROM members;')
    db.exec("INSERT INTO members(id,name,phone) VALUES(1,'A','1'),(2,'B','2'),(3,'C','3');")
})
after(() => db.close())

test('new schema: no records table, valid zero scores, duplicate event/game rejection', () => {
    assert.equal(db.prepare("SELECT 1 FROM sqlite_master WHERE name='records'").get(), undefined)
    const { eventId } = service.saveEvent(input())
    assert.throws(() => db.prepare('INSERT INTO events(eventId,title,date,image) VALUES(?,?,?,?)').run(eventId, 'Duplicate', '2026-09-13', 'image'))
    assert.throws(() => db.prepare('INSERT INTO games(eventId,memberId,gameNumber,date,score) VALUES(?,1,2,?,1)').run(eventId, '2026-09-13'))
    assert.throws(() => db.prepare('INSERT INTO games(eventId,memberId,date,score) VALUES(?,1,?,1)').run(eventId, '2026-09-13'))
    for (const score of [-1, 301, 1.5]) assert.throws(() => db.prepare('INSERT INTO games(memberId,date,score) VALUES(1,?,?)').run('2026-09-13', score))
})

test('POST save and GET event preserve envelope and missing slots, include game5 and zero', async () => {
    const saved = await request('POST', '/api/events/save', input({records: [...input().records, {name:'B',game1:{score:null}}]}))
    assert.equal(saved.code, 200)
    assert.equal(saved.body.result.gameResult.length, 2)
    const { eventId } = saved.body.result
    const detail = await request('GET', `/api/events/${eventId}`)
    assert.equal(detail.code, 200)
    assert.equal(detail.body.eventInfo.player, 1)
    assert.deepEqual(detail.body.records[0], { eventId, memberId:1, name:'A',game1:null,game2:0,game3:null,game4:null,game5:200,totalScore:200,gameCount:2,average:100 })
    assert.deepEqual(db.prepare('SELECT gameNumber FROM games ORDER BY id').all(), [{gameNumber:2},{gameNumber:5}])
    const personal = await request('GET', '/api/games/1?start=2026-09-13&end=2026-09-13')
    assert.deepEqual(personal.body.games.map(g => g.sequence), [1,2])
    assert(personal.body.games.every(g => g.type === 'regular'))
    assert.equal((await request('GET', '/api/records')).code, 404)
})

test('save validation rejects bad dates, scores, missing/ambiguous members and duplicates without writes', async () => {
    db.prepare("INSERT INTO members(name,phone) VALUES('A','4')").run()
    for (const body of [undefined, {}, input({date:'2026-02-29'}), input({mainGame:'true'}), input({records:[]}), input({records:[{name:'B',game1:{score:null}}]}),
        ...[-1,301,1.2,'100',true].map(score=>input({records:[{name:'B',game1:{score}}]})),
        input(), input({records:[{name:'missing',game1:{score:1}}]}), input({records:[{memberId:1,game1:1},{memberId:1,game2:2}]})]) {
        const before = snapshot()
        const result = await request('POST', '/api/events/save', body)
        assert.equal(result.code, 400, JSON.stringify(body))
        assert.equal(snapshot(), before)
    }
    assert.equal((await request('POST', '/api/events/save', input({records:[{memberId:1,game1:0}]}))).code,200)
})

test('save transaction rolls back an event and earlier games if a later insert fails', () => {
    db.exec("CREATE TRIGGER fail_write BEFORE INSERT ON games WHEN NEW.gameNumber=5 BEGIN SELECT RAISE(ABORT,'test failure'); END;")
    const before = snapshot()
    assert.throws(() => service.saveEvent(input()), /test failure/)
    assert.equal(snapshot(), before)
})

test('identifier remains unique after date edits and deletion gaps', async () => {
    const a = service.saveEvent(input()), b = service.saveEvent(input()), c = service.saveEvent(input())
    service.deleteEvent(b.eventId)
    const d = service.saveEvent(input())
    assert.notEqual(d.eventId,c.eventId)
    await service.modifyEvent({eventId:a.eventId,title:'Moved',date:'2027-01-01',eventType:1,pattern:'',center:'Other'})
    service.saveEvent(input())
    assert.equal(db.prepare('SELECT COUNT(*) n FROM events').get().n,4)
})

test('modify syncs game center/date, rollback and delete are atomic, unrelated games stay intact', async () => {
    const { eventId } = service.saveEvent(input())
    db.prepare('INSERT INTO games(memberId,date,score,center) VALUES(2,?,100,?)').run('2026-01-01','Personal')
    const body = {eventId,title:'Moved',date:'2026-10-01',eventType:0,pattern:'',center:'Other'}
    assert.equal((await request('POST','/api/events/modify',body)).code,200)
    assert(db.prepare('SELECT date,center FROM games WHERE eventId=?').all(eventId).every(g=>g.date===body.date&&g.center===body.center))
    db.exec("CREATE TRIGGER fail_write BEFORE UPDATE ON games BEGIN SELECT RAISE(ABORT,'test failure'); END;")
    let before=snapshot()
    await assert.rejects(service.modifyEvent({...body,date:'2026-11-01'}),/test failure/)
    assert.equal(snapshot(),before)
    db.exec("DROP TRIGGER fail_write; CREATE TRIGGER fail_write BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT,'test failure'); END;")
    before=snapshot(); assert.throws(()=>service.deleteEvent(eventId),/test failure/); assert.equal(snapshot(),before)
    db.exec('DROP TRIGGER fail_write')
    assert.equal((await request('DELETE',`/api/events/${eventId}`)).code,200)
    assert.equal(db.prepare('SELECT COUNT(*) n FROM games').get().n,1)
    assert.equal((await request('DELETE',`/api/events/${eventId}`)).code,404)
    assert.equal((await request('GET',`/api/events/${eventId}`)).code,404)
})

test('statistics count events once, zero counts as attendance, personal games excluded, all games affect range', async () => {
    service.saveEvent(input({date:'2026-01-01',records:[{name:'A',game1:100,game2:200,game5:300},{name:'B',game1:200}]}))
    service.saveEvent(input({date:'2026-12-31',records:[{name:'A',game1:0}]}))
    service.saveEvent(input({date:'2027-01-01',records:[{name:'A',game1:300}]}))
    db.prepare('INSERT INTO games(memberId,date,score) VALUES(1,?,300)').run('2026-06-01')
    const rows=await members.memberStatistics(2026)
    const a=rows.find(r=>r.memberId===1), b=rows.find(r=>r.memberId===2), c=rows.find(r=>r.memberId===3)
    assert.deepEqual(a,{memberId:1,memberName:'A',attendanceCount:2,attendanceRate:100,attendanceRank:1,gameCount:4,averageScore:150,scoreRank:2,deviation:-10,highRow:300})
    assert.equal(b.gameCount,1);assert.equal(b.scoreRank,1);assert.equal(b.deviation,40)
    assert.equal(c.attendanceCount,0);assert.equal(c.gameCount,0);assert.equal(c.averageScore,null);assert.equal(c.scoreRank,null)
    const absent=await members.memberStatistics(2028);assert(absent.every(r=>r.attendanceRate===null&&r.averageScore===null))
    const api=await request('GET','/api/members/statistics?year=2026');assert.equal(api.code,200);assert.deepEqual(api.body,rows)
})

test('tied ranks skip the following rank, and zero-only player has attendance', async () => {
    service.saveEvent(input({records:[{name:'A',game1:200},{name:'B',game1:200},{name:'C',game1:0}]}))
    const rows=await members.memberStatistics(2026)
    assert.deepEqual(rows.sort((a,b)=>a.memberId-b.memberId).map(r=>r.scoreRank),[1,1,3])
    assert.equal(rows[2].attendanceCount,1);assert.equal(rows[2].gameCount,1)
})


test('personal save persists game numbers and permits a new batch on the same day', async () => {
    const body = { memberId: 1, date: '2026-09-14', center: 'Center',
        scores: [{ gameNumber: 1, score: 0 }, { gameNumber: 2, score: 300 }] }
    const saved = await request('POST', '/api/games/save', body)
    assert.equal(saved.code, 201)
    assert.deepEqual(saved.body.games.map(game => game.sequence), [1, 2])
    assert.deepEqual(db.prepare('SELECT gameNumber, score FROM games ORDER BY id').all(), body.scores)
    assert.equal((await request('POST', '/api/games/save', body)).code, 201)
    const fetched = await request('GET', '/api/games/1?start=2026-09-14&end=2026-09-14')
    assert.deepEqual(fetched.body.games.map(game => game.sequence), [1, 2, 3, 4])
})

test('personal save rejects malformed or duplicate game numbers without writing', async () => {
    const body = { memberId: 1, date: '2026-09-14', center: 'Center' }
    for (const scores of [[], [100], [null], [{ score: 100 }],
        ...[0, -1, 1.5, '1', Number.MAX_SAFE_INTEGER + 1].map(gameNumber => [{ gameNumber, score: 100 }]),
        ...[-1, 301, 1.5, '100'].map(score => [{ gameNumber: 1, score }]),
        [{ gameNumber: 1, score: 100 }, { gameNumber: 1, score: 200 }]]) {
        assert.equal((await request('POST', '/api/games/save', { ...body, scores })).code, 400)
        assert.equal(db.prepare('SELECT COUNT(*) AS count FROM games').get().count, 0)
    }
})
