const badRequest = (message) => Object.assign(new Error(message), { status: 400 })

const isValidEventDate = (value) => {
    if (typeof value !== 'string' || !/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value)) return false
    const date = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const validateEventInput = (input) => {
    if (!input || typeof input !== 'object' || Array.isArray(input)) throw badRequest('이벤트 입력이 필요합니다.')
    const { title, date, mainGame, records, pattern = '', center = '', lotto = null } = input
    if (typeof title !== 'string' || !title.trim()) throw badRequest('title은 비어 있지 않은 문자열이어야 합니다.')
    if (!isValidEventDate(date)) throw badRequest('date는 YYYY-MM-DD 형식의 유효한 날짜여야 합니다.')
    if (![true, false, 0, 1].includes(mainGame)) throw badRequest('mainGame은 boolean 또는 숫자 0, 1이어야 합니다.')
    if (typeof pattern !== 'string' || typeof center !== 'string' || (lotto !== null && typeof lotto !== 'string')) {
        throw badRequest('pattern, center는 문자열이며 lotto는 문자열 또는 null이어야 합니다.')
    }
    if (!Array.isArray(records) || records.length === 0) throw badRequest('records에 게임 기록을 입력해야 합니다.')
    const participants = records.map(record => {
        if (!record || typeof record !== 'object' || Array.isArray(record)) throw badRequest('회원별 기록 형식이 올바르지 않습니다.')
        const scores = Object.keys(record).filter(key => /^game[0-9]+$/.test(key)).map(key => {
            const gameNumber = Number(key.slice(4))
            if (!Number.isSafeInteger(gameNumber) || gameNumber < 1 || key !== `game${gameNumber}`) throw badRequest('게임 번호가 올바르지 않습니다.')
            const game = record[key]
            const score = game === null || game === undefined ? null :
                typeof game === 'object' && !Array.isArray(game) ? game.score : game
            if (score === null || score === undefined) return null
            if (!Number.isInteger(score) || score < 0 || score > 300) throw badRequest(`${key} 점수는 0부터 300까지의 정수여야 합니다.`)
            return { gameNumber, score }
        }).filter(Boolean).sort((a, b) => a.gameNumber - b.gameNumber)
        if (scores.length === 0) return null
        if (record.memberId !== undefined) {
            if (!Number.isSafeInteger(record.memberId) || record.memberId < 1) throw badRequest('memberId는 양의 정수여야 합니다.')
        } else if (typeof record.name !== 'string' || !record.name.trim()) {
            throw badRequest('회원 이름 또는 memberId가 필요합니다.')
        }
        return { memberId: record.memberId, name: record.name, scores }
    }).filter(Boolean)
    if (participants.length === 0) throw badRequest('유효한 게임이 한 개 이상 필요합니다.')
    return { title, date, eventType: Number(mainGame), pattern, center, lotto, participants }
}

module.exports = { badRequest, isValidEventDate, validateEventInput }
