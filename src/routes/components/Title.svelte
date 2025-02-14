<script>
    // @ts-nocheck

    import { browser } from "$app/environment";
    import Home from "$lib/images/Home.svelte";
    import { onMount } from "svelte";

    let { navi } = $props();

    let userInfo = $state("");
    let memberName = $derived(userInfo.split("/")[0]);
    let memberNum = $derived(userInfo.split("/")[1]);

    let popupRegistGame = $state(false);

    onMount(() => {
        if (browser) {
            userInfo = localStorage.getItem("userInfo");
        }

        if (!userInfo) {
            location.href = "/";
        } else {
        }
    });

    const handle = {
        onClkHomeBtn: () => {
            if (browser) {
                localStorage.removeItem("userInfo");
                location.href = "/";
            }
        },
    };
</script>

<div class="title">
    <div class="userInfo">
        <h1>{memberName} ({memberNum})</h1>
    </div>

    <div class="navigator">
        <button
            class="navi"
            onclick={() => {
                handle.onClkHomeBtn();
            }}
        >
            <Home />&nbsp;홈
        </button>

        {#each navi as n, i}
            <button class="navi" onclick={n.onClick}>
                {#if !!n.icon}
                    {@const Component = n.icon}
                    <Component />&nbsp;{n.title}
                {/if}
            </button>
        {/each}
    </div>
</div>

<style lang="scss">
    .title {
        & * {
            scrollbar-width: none;
        }
        & > .userInfo {
            padding: 1rem 0;
            margin: 0 1rem;
        }

        & > .navigator {
            display: flex;
            overflow-x: auto;
            height: 3rem;
            margin: 0 0.5rem;

            & > .navi {
                padding: 0 1.5rem;
                text-align: center;
                border: 1px solid gray;
                border-radius: 1.5rem;
                white-space: nowrap;
                margin: 0 0.25rem;

                display: flex;
                align-items: center;

                color: white;
                font-size: 1rem;

                background-color: #282828;
            }
        }
    }
</style>
