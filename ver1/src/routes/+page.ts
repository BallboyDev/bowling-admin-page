import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
    const result = await fetch('/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const players = await result.json()

    console.log(players)

    return { scores: players }
}