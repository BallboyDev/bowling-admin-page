import type { Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import Players from "$lib/server/database/models/Players";
import dayjs from "dayjs";
import Members from "$lib/server/database/models/Members";

export const load: PageServerLoad = async () => {
    console.log('PageServerLoad')
    const list = JSON.parse(JSON.stringify((await Players.find().sort({ team: 1, name: 1, guest: 1 }))));
    // console.log(plainList)

    return { list: list };
}

export const actions: Actions = {
    regist: async ({ request, url }) => {
        console.log('[ regist ]')
        const data = await request.formData()
        const name = data.get("registName")
        const date = url.searchParams.get('date')

        const member = await Members.findOne({ name: name })
        console.log(member)

        const saveData = {
            // date: dayjs(date?.toString()).add(9, 'h').toDate(),
            date: dayjs('2025-01-01').toDate(),
            memberId: member?._id || null,
            name: name,
            handicap: !!member && member.gender ? 15 : 0,
            guest: !member
        }

        const result = await new Players(saveData).save()
        console.log(result)
    },
    teamChange: async ({ url }) => {
        console.log('[ changeTeam ]')

        const id = url.searchParams.get('id')
        const team = url.searchParams.get('team') === 'true'

        const result = await Players.updateOne({ _id: id }, { $set: { team: !team } })

        console.log(id, team, result)
    },
    delete: async ({ url }) => {
        console.log('[ delete ]')

        const id = url.searchParams.get('id')

        const result = await Players.deleteOne({ _id: id })

        console.log(result)
    }
}