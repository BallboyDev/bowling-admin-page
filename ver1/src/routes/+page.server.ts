import Members from "$lib/server/database/models/Members";
import { json, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
    login: async ({ request, url }) => {
        console.log('login', { request, url })

        const data = await request.formData()

        const name = data.get('name')
        const pw = data.get('pw')

        if (!name && !pw) {
            console.log('name or pw is empty')
            return;
        }

        const user = await Members.findOne({ name: name, password: pw }, { name: true })

        console.log(user)

        return { success: true, user: JSON.stringify(user) }
    }
}