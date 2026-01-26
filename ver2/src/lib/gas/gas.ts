import { memberState } from "../state/state.svelte";


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
    test: async () => {
        // const data = await api.doGet({ action: "test", lastGame: "1월 4주차" });
        // return data.json()

        const data = await api.doGet({
            action: "test",
            number: 29
        })

        return data.json()
    },
    login: async (name: string, number: string) => {
        // const data = await fetch(`${env.GAS_URL}?sheetId=${env.SHEET_ID}&action=login&name=${name}&number=${number}`);
        const param = {
            action: "login",
            name: name,
            number: number
        }
        const data = await api.doGet(param);
        return data.json()
    },
    getMembers: async () => {
        const data = await api.doGet({ action: "getMembers" });
        return data.json()
    },
    getMemberRecord: async () => {
        const data = await api.doGet({ action: "getMemberRecord", number: localStorage.getItem("number") })
        return data.json()
    },
    getGames: async () => {
        const data = await api.doGet({ action: "getGames" });
        return data.json()
    },
    getLastGame: async () => {
        const data = await api.doGet({ action: "getLastGame" });
        return data.json()
    },
    getBettingPrize: async () => {
        const data = await api.doGet({ action: 'getBettingPrize' })
        return data.json()
    },
    addMember: async (name: string, number: string, phone: string) => {
        const data = await api.doPost({
            action: "addMember",
            name,
            number,
            phone,
        })

        return data.json()
    },
    changeTeam: async (game, num) => {
        const data = await api.doPost({
            action: "changeTeam",
            lastGame: "lastGame",
            number: num
        })

        return data.json()
    },
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
    createNewGame: async (title: string, pattern: string, memberList: any[], guestList: any[]) => {
        const data = await api.doPost({
            action: 'createNewGame2',
            title,
            pattern,
            memberList: JSON.stringify(memberList),
            guestList: JSON.stringify(guestList),
        })
        return data.json()
    },
    newGameSave: async () => {
        const data = await api.doPost({
            action: 'newGameSave'
        })

        return data.json()
    }

}

export default gasApi;