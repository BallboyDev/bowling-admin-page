<script lang="ts">
    import { Button } from "@sveltestrap/sveltestrap";
    import gasApi from "../gas/gas";
    import { testState, memberState, gameState } from "../state/state.svelte";
    import { onMount } from "svelte";

    const handle = {
        test: async () => {
            console.log("test...");
            // const data = await gasApi.test();

            const data = await gasApi.test();
            console.log(data);

            // console.log("memberList >>", memberState.memberList);
            // console.log("gameList >>", gameState.gameList);
        },
    };
</script>

<Button onclick={handle.test}>test2</Button>
