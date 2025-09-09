<script lang="ts">
    import { onMount } from "svelte";

    let data = $state("");

    onMount(() => {
        console.log("onMount()");
        const info = localStorage.getItem("user");

        console.log(info);
        data = info || "";
    });

    $effect(() => {
        console.log("$effect()");
        console.log(data);

        const info = localStorage.getItem("user");
        if (info !== data) {
            localStorage.setItem("user", data);
        }
    });
</script>

<div class="title">
    <h1>개빡세 X월 X주차 정기전</h1>

    <!-- {#if !data} -->
    <input type="text" bind:value={data} />
    <!-- {/if} -->
</div>

<style lang="scss">
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        & > h1 {
            margin-bottom: 1rem;
        }

        & > input {
            height: 1.5rem;
        }
    }
</style>
