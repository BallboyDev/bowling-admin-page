// @ts-nocheck
import { browser } from '$app/environment'
import { writable } from 'svelte/store'

// const storage_setMember = (key, initValue) => {
//     let value = initValue
//     if (browser) {
//         const storedValue = localStorage.getItem(key)
//         // if (storedValue === null) {
//         //     localStorage.setItem(key, value)
//         // } else {
//         //     temp = storedValue
//         // }

//         const temp = writable(storedValue !== null ? JSON.parse(storedValue) : initValue)
//         temp.subscribe((v) => { localStorage.setItem(key, JSON.stringify(v)) })
//         value = temp
//     }

//     return value
// }

// export const setMember = storage_setMember('setMember', {})

export const setMember = writable({})
