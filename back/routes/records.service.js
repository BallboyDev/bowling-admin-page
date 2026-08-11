const db = require('../database/db');

const records = async (req, res) => {
    const result = db.prepare('select * from records order by member_id').all()

    return result.map((v) => {
        // console.log(v)

        const record = {
            title_id: v.title_id,
            member_id: v.member_id,
            title: v.title,
            date: v.date,
            name: v.name,
            game1: v.game1,
            game2: v.game2,
            game3: v.game3,
            game4: v.game4,
            total_score: (v.game1 || 0) + (v.game2 || 0) + (v.game3 || 0) + (v.game4 || 0),
            game_count: (!!v.game1 ? 1 : 0) + (!!v.game2 ? 1 : 0) + (!!v.game3 ? 1 : 0) + (!!v.game4 ? 1 : 0),
            average: ((v.game1 || 0) + (v.game2 || 0) + (v.game3 || 0) + (v.game4 || 0)) / ((!!v.game1 ? 1 : 0) + (!!v.game2 ? 1 : 0) + (!!v.game3 ? 1 : 0) + (!!v.game4 ? 1 : 0)),
        }

        return record
    })
}

const gameList = async (req, res) => {
    const result = db.prepare(`select ROW_NUMBER() OVER ( ORDER BY title_id ) pos, title, title_id from records group by title order by title_id`).all()

    return result
}

const gameInfo = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'title_id는 필수입니다.'
        });
    }

    const result = db.prepare('select * from records where title_id = ?').all(id)

    return result
}


module.exports = {
    records,
    gameList,
    gameInfo
}