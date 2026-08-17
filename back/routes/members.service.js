const db = require('../database/db');

const members = async () => {

    console.log('members')
    const result = db.prepare('select * from members order by auth ').all();

    return result;

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
    memberInfo,
    createMember,
    modifyMember,
    deleteMember
};  