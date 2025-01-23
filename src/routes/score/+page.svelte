<script>
    // @ts-nocheck

    import { browser } from "$app/environment";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Add from "$lib/images/Add.svelte";
    import Controller from "$lib/images/Controller.svelte";
    import Dashboard from "$lib/images/Dashboard.svelte";
    import Home from "$lib/images/Home.svelte";
    import More from "$lib/images/More.svelte";
    import UserInfo from "$lib/images/UserInfo.svelte";
    import axios from "axios";
    import dayjs from "dayjs";
    import { onMount } from "svelte";
    import RegistGame from "./components/RegistGame.svelte";
    import { Button, ButtonGroup } from "@sveltestrap/sveltestrap";
    import AddScore from "./components/AddScore.svelte";
    import Change from "$lib/images/Change.svelte";
    import AddBox from "$lib/images/AddBox.svelte";
    import Close from "$lib/images/Close.svelte";
    import GameCard from "./components/GameCard.svelte";
    import SelectBtn from "../components/SelectBtn.svelte";

    let records = $state({});
    let popupRegistGame = $state(false);

    let userInfo = $state("");
    let memberName = $derived(userInfo.split("/")[0]);
    let memberNum = $derived(userInfo.split("/")[1]);

    onMount(() => {
        if (browser) {
            userInfo = localStorage.getItem("userInfo");
        }

        if (!userInfo) {
            location.href = "/";
        } else {
            callApi.getScore();
        }
    });

    $effect(() => {});

    const handle = {
        onClkHomeBtn: () => {
            if (browser) {
                localStorage.removeItem("userInfo");
                location.href = "/";
            }
        },
        onClkRegistGameBtn: () => {
            popupRegistGame = true;
        },
    };

    const callApi = {
        getScore: async () => {
            await axios
                .get(`${PUBLIC_API_URL}/bap/scoreRecord/${memberNum}`)
                .then((res) => {
                    records = res.data;
                });
        },
    };
</script>

{#if popupRegistGame}
    <RegistGame
        onCancel={() => {
            popupRegistGame = false;
        }}
        getScore={() => {
            callApi.getScore();
        }}
        {memberNum}
    />
{/if}

<div id="tempPage">
    <div class="title">
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
        <button class="navi">
            <Controller />&nbsp;필터
        </button>
        <button
            class="navi"
            onclick={() => {
                handle.onClkRegistGameBtn();
            }}
        >
            <Dashboard />&nbsp;게임등록
        </button>
        <button class="navi">
            <UserInfo />&nbsp;회원정보수정
        </button>
    </div>

    <div class="contents">
        <!-- 일시, 장소, 총점, 평균, 메모 -->
        {#each records as record}
            <GameCard
                {record}
                {memberNum}
                reloadScore={() => {
                    callApi.getScore();
                }}
            />
        {/each}
    </div>
</div>

<style lang="scss">
    #tempPage {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;

        & * {
            scrollbar-width: none;
        }

        & > .title {
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

        & > .contents {
            padding: 1rem 0;
            margin: 0 1rem;
            flex: 1;

            overflow: scroll;
        }
    }
</style>
