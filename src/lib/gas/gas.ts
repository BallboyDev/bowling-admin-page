import { loadingState, memberState, settings } from "../state/state.svelte";


const env = {
    GAS_URL: import.meta.env.VITE_GAS_URL,
    SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID,
};

const api = {
    doGet: async (param: { action: string, [key: string]: any }) => {
        const p = Object.keys(param).reduce((a, c) => {
            return a + `&${c}=${param[c]}`;
        }, "");

        return await fetch(`${env.GAS_URL}?sheetId=${env.SHEET_ID}${p}`);
    },
    doPost: async (param: { action: string, [key: string]: any }) => {
        return await fetch(env.GAS_URL, {
            method: "POST",
            body: new URLSearchParams({
                sheetId: env.SHEET_ID,
                ...param
            }),
        })
    }
}



const gasApi = {
    /** 테스트 함수 */
    test: async () => {
        // const data = await api.doGet({ action: "test", lastGame: "1월 4주차" });
        // return data.json()

        const data = await api.doGet({
            action: "test",
            number: 29
        })

        return data.json()
    },
    /** 로그인 API */
    login: async (name: string, number: string) => {
        loadingState.isLoading = true;
        // const data = await fetch(`${env.GAS_URL}?sheetId=${env.SHEET_ID}&action=login&name=${name}&number=${number}`);
        const param = {
            action: "login",
            name: name,
            number: number
        }
        const data = await api.doGet(param);
        return data.json()
    },
    /** 회원 리스트 가져오기 */
    getMembers: async () => {
        const data = await api.doGet({ action: "getMembers" });
        return data.json()
    },
    /** 본인 기록 가져오기 */
    getMemberRecord: async () => {
        const data = await api.doGet({ action: "getMemberRecord", number: localStorage.getItem("number") })
        return data.json()
    },
    /** 게임 기록 리스트 가져오기 */
    getGames: async () => {
        const data = await api.doGet({ action: "getGames" });
        return data.json()
    },
    /** 마지막 게임 정보 가져오기 */
    getLastGame: async () => {
        const data = await api.doGet({ action: "getLastGame" });
        return data.json()
    },
    /** 베팅 상금 정보 가져오기 */
    getBettingPrize: async () => {
        const data = await api.doGet({ action: 'getBettingPrize' })
        return data.json()
    },
    /** 회원 추가 */
    addMember: async (name: string, number: string, phone: string, etc: string) => {
        loadingState.isLoading = true;
        const data = await api.doPost({
            action: "addMember",
            name,
            number,
            phone,
            etc
        })

        loadingState.isLoading = false;

        return data.json()
    },
    /** 회원 정보 변경 */
    updateMember: async (number, name, auth, handicap, phone, point) => {

        const data = await api.doPost({
            action: "updateMember",
            number,
            name,
            auth,
            handicap,
            phone,
            point
        })

        // settings(['getMembers', 'getMemberRecord'])
        settings()

        return data.json()
    },
    /** 팀 변경 */
    changeTeam: async (game, num) => {
        const data = await api.doPost({
            action: "changeTeam",
            lastGame: "lastGame",
            number: num
        })

        return data.json()
    },
    /** 점수 변경 */
    changeScore: async (game, row, prevScore, currentScore) => {
        const data = await api.doPost({
            action: 'changeScore',
            game,
            row: JSON.stringify(row),
            prevScore,
            currentScore
        })

        return data.json()
    },
    /** 점수 업데이트 */
    updateScore: async (number, game, currentScore) => {
        const data = await api.doPost({
            action: 'updateScore',
            number,
            game,
            currentScore
        })

        return data.json()
    },
    /** 베팅 참여 */
    joinBetting: async (game) => {
        const bet = {
            bet1: '1',
            bet2: '2',
            bet3: '3'
        }

        const data = await api.doPost({
            action: 'joinBetting',
            game: game === 'all' ? '1|2|3' : bet[game],
            playerInfo: JSON.stringify(memberState.memberInfo)
        })

        return data.json()
    },
    /** 새로운 게임 만들기 */
    createNewGame: async (title: string, pattern: string, memberList: any[], guestList: any[]) => {
        loadingState.isLoading = true;
        const data = await api.doPost({
            action: 'createNewGame',
            title,
            pattern,
            memberList: JSON.stringify(memberList),
            guestList: JSON.stringify(guestList),
        })

        // settings(['getLastGame']);
        settings()
        return data.json()
    },
    /** 게임 기록 업데이트 */
    newGameSave: async () => {
        loadingState.isLoading = true;
        const data = await api.doPost({
            action: 'newGameSave'
        })

        settings();
        return data.json()
    }

}

export default gasApi;