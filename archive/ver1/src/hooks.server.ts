import { dbConnect } from "$lib/server/database";
import type { Handle } from "@sveltejs/kit";

dbConnect().catch((ex) => {
    console.log(ex)
})

export const handle: Handle = async ({ event, resolve }) => {
    const response = resolve(event)

    return response
}