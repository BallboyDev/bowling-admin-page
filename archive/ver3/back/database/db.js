const path = require('node:path')
const Database = require('better-sqlite3')
const { initializeSchema } = require('./schema')

const db = new Database(process.env.BOWLING_DB_PATH || path.join(__dirname, 'app.db'))
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.pragma('busy_timeout = 5000')
try {
    initializeSchema(db)
} catch (error) {
    db.close()
    throw error
}
module.exports = db
