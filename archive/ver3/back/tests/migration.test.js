const { test } = require('node:test')
const assert = require('node:assert/strict')
const Database = require('better-sqlite3')
const { migrate } = require('../database/migrations/games-only')
const { initializeSchema } = require('../database/schema')
function legacy() {
    const db=new Database(':memory:')
    db.exec(`CREATE TABLE members(id INTEGER PRIMARY KEY,name TEXT);
        CREATE TABLE events(id INTEGER PRIMARY KEY,eventId TEXT,date TEXT);
        CREATE TABLE records(id INTEGER PRIMARY KEY,eventId TEXT,memberId INTEGER,game1 NUMERIC,game2 NUMERIC,game3 NUMERIC,game4 NUMERIC,game5 NUMERIC,game6 NUMERIC,totalScore NUMERIC,gameCount NUMERIC,average NUMERIC);
        CREATE TABLE games(id INTEGER PRIMARY KEY AUTOINCREMENT,eventId TEXT,recordId NUMERIC,memberId NUMERIC,date TEXT,score NUMERIC,center TEXT,records NUMERIC DEFAULT 0,created_at TEXT);
        INSERT INTO members VALUES(1,'A');INSERT INTO events VALUES(1,'e1','2026-01-01');
        INSERT INTO records VALUES(7,'e1',1,NULL,0,NULL,100,200,NULL,300,3,100);
        INSERT INTO games VALUES(10,'e1',7,1,'2026-01-01',0,'C',0,'created'),(12,'e1',7,1,'2026-01-01',100,'C',0,'created'),(15,'e1',7,1,'2026-01-01',200,'C',0,'created'),(16,NULL,NULL,1,'2026-01-01',50,'P',0,'personal');
        UPDATE sqlite_sequence SET seq=100 WHERE name='games';`)
    return db
}
function snapshot(db) {return JSON.stringify({schema:db.prepare('SELECT * FROM sqlite_master ORDER BY name').all(),games:db.prepare('SELECT * FROM games ORDER BY id').all(),records:db.prepare('SELECT * FROM records ORDER BY id').all()})}

test('migration keeps IDs, gaps, personal games, timestamps and AUTOINCREMENT; rerun is safe',()=>{
    const db=legacy()
    try {
        const result=migrate(db);assert.equal(result.gamesPreserved,4);assert.equal(result.skippedSlotRecords,1)
        assert.deepEqual(db.prepare('SELECT id,gameNumber,created_at FROM games ORDER BY id').all(),[{id:10,gameNumber:2,created_at:'created'},{id:12,gameNumber:4,created_at:'created'},{id:15,gameNumber:5,created_at:'created'},{id:16,gameNumber:null,created_at:'personal'}])
        assert.equal(db.pragma('table_info(games)').some(c=>c.name==='recordId'||c.name==='records'),false)
        assert.equal(db.prepare("SELECT 1 FROM sqlite_master WHERE name='records'").get(),undefined)
        assert.deepEqual(migrate(db),{alreadyMigrated:true})
        assert.equal(db.prepare("INSERT INTO games(memberId,date,score) VALUES(1,'2026-01-01',0)").run().lastInsertRowid,101)
    } finally {db.close()}
})

test('migration aborts mismatched data without any schema or data change',()=>{
    for(const sql of ["UPDATE games SET score=101 WHERE id=12", "DELETE FROM games WHERE id=12", "UPDATE records SET totalScore=301", "UPDATE games SET eventId='bad' WHERE id=10", "UPDATE games SET records=1 WHERE id=10", "INSERT INTO events VALUES(2,'e1','2026-01-01')", "UPDATE games SET recordId=99 WHERE id=10", "ALTER TABLE games ADD COLUMN important TEXT"]) {
        const db=legacy()
        try {db.exec(sql);const before=snapshot(db);assert.throws(()=>migrate(db),undefined,sql);assert.equal(snapshot(db),before)} finally {db.close()}
    }
})

test('failure during schema replacement rolls back dropped/rebuilt tables',()=>{
    const db=legacy()
    try {
        const before=snapshot(db), exec=db.exec.bind(db)
        db.exec=(sql)=>{if(sql.includes('CREATE UNIQUE INDEX'))throw Error('simulated index failure');return exec(sql)}
        assert.throws(()=>migrate(db),/simulated/);assert.equal(snapshot(db),before)
    } finally {db.close()}
})

test('server schema initializer refuses legacy DB instead of silently deleting data',()=>{
    const db=legacy()
    try {const before=snapshot(db);assert.throws(()=>initializeSchema(db),/이관/);assert.equal(snapshot(db),before)} finally {db.close()}
})
