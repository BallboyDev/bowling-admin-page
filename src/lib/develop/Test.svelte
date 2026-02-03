<script lang="ts">
    import { Button, Column, Table } from "@sveltestrap/sveltestrap";
    import gasApi from "../gas/gas";
    import {
        memberState,
        gameState,
        settings,
        // settings2,
    } from "../state/state.svelte";

    // $effect(() => {
    //     settings();
    // });

    const handle = {
        test: async () => {
            console.log("test...");
            // const data = await gasApi.test();

            const data = await gasApi.getBettingPrize();
            console.log(data);

            // console.log("memberList >>", memberState.memberList);
            // console.log("gameList >>", gameState.gameList);
        },
    };
</script>

<div>
    <div class="d-flex gap-2 my-2">
        <Button onclick={handle.test}>test1</Button>
        <Button
            onclick={() => {
                // console.log(gameState.lastGame);
                // console.log(a1, l1);
                // settings();
            }}>test2</Button
        >
        <Button
            onclick={() => {
                // settings2(["getMembers"]);
            }}>test3</Button
        >
    </div>

    <div></div>
</div>

<!-- 'getMembers','getMemberRecord','getGames','getLastGame', -->
