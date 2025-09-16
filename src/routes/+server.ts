import Members from "$lib/server/database/models/Members";
import Players from "$lib/server/database/models/Players";
import { json, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ request }) => {
    const players = await Players.find({}).lean()

    return json({ players: players });
};

export const POST: RequestHandler = async ({ request }) => {
    return json({});
}