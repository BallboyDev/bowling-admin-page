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
    import Title from "../components/Title.svelte";
    import ChartArrowBottomRight from "$lib/images/ChartArrowBottomRight.svelte";
    import FilterScore from "../components/FilterScore.svelte";
    import { getStorage } from "$lib/localStorage.svelte";

    let records = $state({});
    let popupRegistGame = $state(false);
    let filterScore = $state(false);

    let userInfo = $state("");
    let memberName = $derived(userInfo.split("/")[0]);
    let memberNum = $derived(userInfo.split("/")[1]);

    onMount(() => {
        // if (browser) {
        //     userInfo = localStorage.getItem("userInfo");
        // }

        userInfo = getStorage("userInfo");

        if (!userInfo) {
            location.href = "/";
        } else {
            callApi.getScore();
        }
    });

    const handle = {
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

{#if filterScore}
    <FilterScore
        onClose={() => {
            filterScore = false;
        }}
    />
{/if}

<div id="scorePage">
    <Title
        {memberName}
        {memberNum}
        navi={[
            {
                title: "분석",
                icon: ChartArrowBottomRight,
                onClick: () => {
                    location.href = "/total";
                },
            },
            {
                title: "필터",
                icon: Controller,
                onClick: () => {
                    filterScore = true;
                },
            },
            {
                title: "게임등록",
                icon: Dashboard,
                onClick: () => {
                    handle.onClkRegistGameBtn();
                },
            },
        ]}
    />

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
    #scorePage {
        width: 100%;
        max-width: 576px;
        height: 100vh;
        display: flex;
        flex-direction: column;

        & * {
            scrollbar-width: none;
        }

        & > .contents {
            padding: 1rem 0;
            margin: 0 1rem;
            flex: 1;

            overflow: scroll;
        }
    }
</style>
