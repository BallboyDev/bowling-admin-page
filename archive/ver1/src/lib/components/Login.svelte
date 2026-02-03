<script lang="ts">
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";
    import type { ActionData } from "../../routes/$types";

    let user = $state<string | null>("");
    let name = $state<string | null>("ballboy");
    let pw = $state<string | null>("1234");

    let { form } = $props<{ form?: ActionData }>();

    $effect(() => {
        console.log(form);
    });

    // cookieStore.set("pw", encodeURIComponent(result.password));
</script>

<div class="title">
    <h1>개빡세 X월 X주차 정기전</h1>

    {#if !form?.success}
        <form method="POST" use:enhance>
            <input type="text" name="name" bind:value={name} />
            <input type="password" name="pw" bind:value={pw} />
            <button type="submit" formaction={`?/login`}>등록</button>
            {form}
        </form>
    {:else}
        <div>
            <!-- <input type="text" bind:value={user} disabled /> -->
            <a href="/member">user</a>
            <button onclick={() => {}}>삭제</button>
        </div>
    {/if}
</div>

<style lang="scss">
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        // & > div {
        //     display: flex;
        //     flex-direction: row;
        // }
        & > h1 {
            margin-bottom: 1rem;
        }

        & input {
            height: 1.5rem;
        }
        & a {
            margin-right: 1rem;
            font-size: 1.2rem;
        }
        & button {
            height: 1.5rem;
            width: 3rem;
        }
    }
</style>
