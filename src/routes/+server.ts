import Players from "$lib/server/database/models/Players";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const players = await Players.find({}).lean()

    return json({ players: players });
};
