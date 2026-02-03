import gasApi from "../gas/gas";

export const authState = $state({
    auth: 0
})

// loading Status
export const loadingState = $state({
    isLoading: false
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
    prize: {
        "p13": {
            "g1": 12000,
            "g2": 9000,
            "g3": 7000,
            "g4": 5000,
            "g5": 3000,
            "g6": 2000,
            "g7": 1000
        },
        "p12": {
            "g1": 12000,
            "g2": 8000,
            "g3": 6000,
            "g4": 4000,
            "g5": 3000,
            "g6": 2000,
            "g7": 1000
        },
        "p11": {
            "g1": 10000,
            "g2": 8000,
            "g3": 6000,
            "g4": 5000,
            "g5": 3000,
            "g6": 1000
        },
        "p10": {
            "g1": 10000,
            "g2": 7000,
            "g3": 5000,
            "g4": 4000,
            "g5": 3000,
            "g6": 1000
        },
        "p9": {
            "g1": 9000,
            "g2": 7000,
            "g3": 5000,
            "g4": 4000,
            "g5": 2000
        },
        "p8": {
            "g1": 9000,
            "g2": 7000,
            "g3": 5000,
            "g4": 3000
        },
        "p7": {
            "g1": 9000,
            "g2": 7000,
            "g3": 4000,
            "g4": 1000
        },
        "p6": {
            "g1": 8000,
            "g2": 7000,
            "g3": 3000
        },
        "p5": {
            "g1": 8000,
            "g2": 5000,
            "g3": 2000
        },
        "p4": {
            "g1": 8000,
            "g2": 4000
        },
        "p3": {
            "g1": 6000,
            "g2": 3000
        }
    }
})



export const settings = () => {
    loadingState.isLoading = true;

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
        console.log('memberState.memberList >>', $state.snapshot(memberState.memberList))
        console.log('memberState.memberInfo >>', $state.snapshot(memberState.memberInfo))
        console.log('memberState.memberRecord >>', $state.snapshot(memberState.memberRecord))
        console.log('gameState.gameList >>', $state.snapshot(gameState.gameList))
        console.log('gameState.lastGame >>', $state.snapshot(gameState.lastGame))
        console.log('bettingState.prize >>', $state.snapshot(bettingState.prize))


        loadingState.isLoading = false;
        console.log('data loading completed')
    });
}

// export const settings = (apiList: string[] = []) => {
//     // getMembers, getMemberRecord, getGames, getLastGame

//     if (apiList.includes('getMembers') || apiList.length === 0) {
//         gasApi.getMembers().then((res) => {
//             memberState.memberList = res;
//             memberState.memberInfo = res.find((v) => { return `${v['회원번호']}` === `${localStorage.getItem('number')}` })
//         }).finally(() => {
//             console.log('memberState.memberList >>', $state.snapshot(memberState.memberList))
//             console.log('memberState.memberInfo >>', $state.snapshot(memberState.memberInfo))
//         })
//     }
//     if (apiList.includes('getMemberRecord') || apiList.length === 0) {
//         gasApi.getMemberRecord().then((res) => {
//             memberState.memberRecord = res;
//         }).finally(() => {
//             console.log('memberState.memberRecord >>', $state.snapshot(memberState.memberRecord))
//         })
//     }
//     if (apiList.includes('getGames') || apiList.length === 0) {
//         gasApi.getGames().then((res) => {
//             gameState.gameList = res;
//         }).finally(() => {
//             console.log('gameState.gameList >>', $state.snapshot(gameState.gameList))
//         })
//     }
//     if (apiList.includes('getLastGame') || apiList.length === 0) {
//         gasApi.getLastGame().then((res) => {
//             gameState.lastGame = res;
//         }).finally(() => {
//             console.log('gameState.lastGame >>', $state.snapshot(gameState.lastGame))
//         })
//     }


//     // if (apiList.includes('getBettingPrize') || apiList.length === 0) {
//     //     gasApi.getLastGame().then((res) => {
//     //         const result = res
//     // result.map((v1) => {
//     //     v1.filter((v2) => { return v2 !== '' })
//     // })
//     //         bettingState.prize = result
//     //     }).finally(() => {
//     console.log('bettingState >>', $state.snapshot(bettingState.prize))
//     //     })
//     // }

//     loadingState.isLoading = false;
// }