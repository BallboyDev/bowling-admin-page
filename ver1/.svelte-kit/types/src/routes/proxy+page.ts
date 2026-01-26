// @ts-nocheck
import type { PageLoad } from "./$types";

export const load = async ({ fetch }: Parameters<PageLoad>[0]) => {
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