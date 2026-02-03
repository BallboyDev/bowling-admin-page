import { loadingState, memberState, settings } from "../state/state.svelte";

export const getUserInfo = (num: number) => {
    const member = memberState.memberList.find((m: any) => `${m['회원번호']}` === `${num}`);
    if (member) {
        return member;
    } else {
        return {
            number: num,
            name: "알 수 없음",
            totalGames: 0,
            totalScore: 0,
            averageScore: 0,
        };
    }
}