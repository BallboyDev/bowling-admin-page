const db = require('../database/db');

const members = async () => {

    console.log('members')
    const result = db.prepare(`
            select id, 
                    name, 
                    auth, 
                    phone, 
                    style, 
                    birth, 
                    created_at as joinDate, 
                    grade
                from members 
                order by auth
        `).all();

    return result;

}

const memberStatistics = async (year) => {
    const startDate = `${String(year).padStart(4, '0')}-01-01`;
    const endDate = `${String(year + 1).padStart(4, '0')}-01-01`;

    return db.prepare(`
        SELECT
            s.id AS "memberId",
            s.name AS "memberName",
            s.grade as "memberGrade",
            s.attendance_count AS "attendanceCount",
            ROUND(
                s.attendance_count * 100.0 / NULLIF((
                    SELECT COUNT(*)
                    FROM events
                    WHERE date >= @startDate AND date < @endDate
                ), 0),
                2
            ) AS "attendanceRate",
            RANK() OVER (ORDER BY s.attendance_count DESC) AS "attendanceRank",
            s.game_count AS "gameCount",
            ROUND(s.average_score, 2) AS "averageScore",
            CASE
                WHEN s.average_score IS NOT NULL THEN
                    RANK() OVER (ORDER BY s.average_score DESC)
            END AS "scoreRank",
            ROUND(
                s.average_score
                - SUM(s.total_score) OVER () * 1.0
                  / NULLIF(SUM(s.game_count) OVER (), 0),
                2
            ) AS "deviation",
            s.score_range AS "highRow"
        FROM (
            SELECT
                m.id,
                m.name,
                m.grade,
                COUNT(DISTINCT g.eventId) AS attendance_count,
                COUNT(g.id) AS game_count,
                SUM(g.score) AS total_score,
                AVG(g.score) AS average_score,
                MAX(g.score) - MIN(g.score) AS score_range
            FROM members m
            LEFT JOIN games g
                ON g.memberId = m.id
               AND EXISTS (
                    SELECT 1
                    FROM events e
                    WHERE e.eventId = g.eventId
                      AND e.date >= @startDate AND e.date < @endDate
               )
            GROUP BY m.id, m.name
        ) s
    `).all({ startDate, endDate });
}

const memberInfo = async (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: 'id는 필수입니다.'
        });
    }

    const result = db.prepare('select * from members where id = ?').get(id);

    if (!result) {
        return res.status(404).json({
            message: '해당 id의 회원을 찾을 수 없습니다.'
        });
    }

    return result;

}


const createMember = async (req, res) => {

    try {
        const { auth = 2, name, phone, style = '', birth } = req.body;

        if (!name?.trim() || !phone?.trim()) {
            return res.status(400).json({
                message: 'name과 phone은 필수입니다.'
            });
        }

        const result = db.prepare(`
            INSERT INTO members (auth, name, phone, style, birth)
            VALUES (?, ?, ?, ?, ?)
        `).run(auth, name.trim(), phone.trim(), style.trim(), birth);

        const createdMember = db.prepare(`
            SELECT id, auth, name, phone, style, birth, created_at
            FROM members
            WHERE id = ?
        `).get(result.lastInsertRowid);

        return createdMember;

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '회원 생성 중 오류가 발생했습니다.' });
    }

}

const deleteMember = async (req, res) => {
    try {
        const { id } = req.params

        const result = db.prepare(`delete from members where id = ?`).run(id)

        return result
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '회원 삭제 중 오류가 발생했습니다.' });
    }
}

const modifyMember = async (req, res) => {
    try {
        const { id } = req.params
        const { name, auth, phone, style, birth } = req.body

        const result = db.prepare(`
            update members
            set auth = ?,
                phone = ?,
                style = ?,
                birth = ?
            where id = ?
            `).run(auth, phone, style, birth, id)



        return result
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: '회원 정보 수정중 오류가 발생했습니다.' });
    }
}


module.exports = {
    members,
    memberStatistics,
    memberInfo,
    createMember,
    modifyMember,
    deleteMember
};
