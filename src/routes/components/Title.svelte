<script>
    // @ts-nocheck

    import { browser } from "$app/environment";
    import Home from "$lib/images/Home.svelte";
    import Menu from "$lib/images/Menu.svelte";
    import { removeStorage } from "$lib/localStorage.svelte";
    import { onMount } from "svelte";

    let { navi, memberName = "tester", memberNum = "0000" } = $props();

    let popupRegistGame = $state(false);

    onMount(() => {});

    const handle = {
        onClkHomeBtn: () => {
            // if (browser) {
            //     localStorage.removeItem("userInfo");
            //     location.href = "/";
            // }

            removeStorage("userInfo");
            location.href = "/";
        },
    };
</script>

<div class="title">
    <div class="userInfo d-flex justify-content-between align-items-center">
        <h1>{memberName} ({memberNum})</h1>
        <Menu />
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
                {:else}
                    {@const Component = Menu}
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
