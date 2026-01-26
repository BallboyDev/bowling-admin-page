import gasApi from "../gas/gas";


// test
export const testState = $state({
    data1: ''
})

// getMembers
export const memberState = $state({
    memberList: [],
    memberInfo: {},
    memberRecord: []
})

// getGames
export const gameState: { gameList: any[], lastGame: { lastGame: string, pattern: string, status: string, data: any[] } } = $state({
    gameList: [],
    lastGame: {
        lastGame: "",
        pattern: "",
        status: "before",
        data: []
    },
})

export const bettingState = $state({
    prize: [
        ["1등", 12000, 12000, 10000, 10000, 9000, 9000, 9000, 8000, 8000, 8000, 6000, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["2등", 9000, 8000, 8000, 7000, 7000, 7000, 7000, 7000, 5000, 4000, 3000, "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["3등", 7000, 6000, 6000, 5000, 5000, 5000, 4000, 3000, 2000, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["4등", 5000, 4000, 5000, 4000, 4000, 3000, 1000, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["5등", 3000, 3000, 3000, 3000, 2000, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["6등", 2000, 2000, 1000, 1000, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["7등", 1000, 1000, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["8등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["9등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["10등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["11등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["12등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
        ["13등", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    ]
})



export const settings = () => {
    Promise.allSettled([
        gasApi.getMembers(),
        gasApi.getMemberRecord(),
        gasApi.getGames(),
        gasApi.getLastGame(),
        // gasApi.getBettingPrize()
    ]).then((res) => {
        // memberList, memberInfo
        if (res[0].status === "fulfilled") {
            memberState.memberList = res[0].value;
            memberState.memberInfo = res[0].value.find((v) => { return `${v['회원번호']}` === `${localStorage.getItem('number')}` })
        } else {
            console.log("Error [memberState.memberList] >>", res[0].reason);
        }

        // memberRecord
        if (res[1].status === "fulfilled") {
            memberState.memberRecord = res[1].value;
        } else {
            console.log(
                "Error [memberState.memberRecord] >>",
                res[1].reason,
            );
        }

        // gameList
        if (res[2].status === "fulfilled") {
            gameState.gameList = res[2].value;
        } else {
            console.log("Error [gameState.gameList] >>", res[2].reason);
        }

        // lastGame
        if (res[3].status === "fulfilled") {
            gameState.lastGame = res[3].value;
        } else {
            console.log("Error [gameState.lastGame] >>", res[3].reason);
        }

        // bettingPrize
        // if (res[4].status === "fulfilled") {
        //     bettingState.prize = res[4].value;
        // } else {
        //     console.log("Error [gameState.lastGame] >>", res[4].reason);
        // }
    }).finally(() => {
        // console.log(memberState)
        // console.log(gameState)

        console.log('memberState.memberList >>', $state.snapshot(memberState.memberList))
        console.log('memberState.memberInfo >>', $state.snapshot(memberState.memberInfo))
        console.log('memberState.memberRecord >>', $state.snapshot(memberState.memberRecord))
        console.log('gameState.gameList >>', $state.snapshot(gameState.gameList))
        console.log('gameState.lastGame >>', $state.snapshot(gameState.lastGame))
        console.log('bettingState.prize >>', $state.snapshot(bettingState.prize))
    });
}