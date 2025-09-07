import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {


    const result = await fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const players = await result.json()

    console.log(players)


    const tempData = [
        { user: 'user1', score1: 173, score2: 214, score3: 197, score4: 206 },
        { user: 'user2', score1: 196, score2: 284, score3: 221, score4: 216 },
        { user: 'user3', score1: 178, score2: 232, score3: 232, score4: 241 },
        { user: 'user4', score1: 177, score2: 160, score3: 294, score4: 285 },
        { user: 'user5', score1: 153, score2: 200, score3: 215, score4: 200 },
        { user: 'user6', score1: 287, score2: 254, score3: 242, score4: 198 },
        { user: 'user7', score1: 236, score2: 230, score3: 296, score4: 245 },
        { user: 'user8', score1: 157, score2: 267, score3: 258, score4: 235 },
        { user: 'user9', score1: 290, score2: 272, score3: 253, score4: 185 },
        { user: 'user10', score1: 211, score2: 177, score3: 298, score4: 284 },
        { user: 'user11', score1: 211, score2: 298, score3: 243, score4: 173 },
        { user: 'user12', score1: 164, score2: 165, score3: 189, score4: 240 },
    ]

    return { scores: players }
}