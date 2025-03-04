// @ts-nocheck
import { browser } from "$app/environment"

const keyList = ['userInfo', 'filter']

export const getStorage = (key = '') => {
    if (browser) {
        if (!!key) {
            return localStorage.getItem(key)
        } else {
            let temp = keyList.map((v) => {
                return { [v]: localStorage.getItem(v) }
            })

            return temp
        }
    }

    return 'not browser'
}

export const setStorage = (key, value) => {
    if (browser) {
        localStorage.setItem(key, value)
    }
}

export const removeStorage = () => {
    keyList.map((v) => {
        localStorage.removeItem(v)
    })
}

export const initStorage = (key = '') => {
    const storage = {
        userInfo: () => {

        },
        filter: () => {
            const value = {

            }
        }
    }
}

