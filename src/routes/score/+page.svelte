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

    let records = $state({});
    let popupAddScore = $state(false);
    let popupRegistGame = $state(false);

    let userInfo = $state("");
    let memberName = $derived(userInfo.split("/")[0]);
    let memberNum = $derived(userInfo.split("/")[1]);
    let cardId = $state(null);

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

    $effect(() => {
        console.log(cardId);
    });

    const handle = {
        onClkAddBtn: (id) => {
            popupAddScore = true;
            cardId = id;
            console.log("onCLickAddBtn()");
        },
        onClkMoreBtn: () => {
            console.log("onClkMoreBtn()");
        },
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
            console.log("ballboy >>", memberName, memberNum);
            await axios
                .get(`${PUBLIC_API_URL}/bap/scoreRecord/${memberNum}`)
                .then((res) => {
                    console.log(res.data);
                    records = res.data;
                });
        },
    };
</script>

{#if popupAddScore}
    <AddScore
        {cardId}
        onClose={() => {
            popupAddScore = false;
            cardId = null;
            callApi.getScore();
        }}
    />
{/if}

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
        <!-- <h1>양승우 (12345 / {userInfo})</h1> -->
        <h1>{memberName} ({memberNum})</h1>
    </div>
    <!-- <Title title="양승우" /> -->

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
            <div class="gameCard">
                <div class="layout">
                    <div class="left">
                        <div class="place">광교진락볼링장</div>
                        <h2 class="date">
                            {dayjs(record.date).format("YYYY.MM.DD (ddd)")}
                        </h2>
                    </div>

                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="more"
                        onclick={() => {
                            handle.onClkMoreBtn();
                        }}
                    >
                        <More />
                    </div>
                </div>
                <div class="memo">-</div>
                <div class="total">
                    <h2>{Math.round(record.avg * 10) / 10}</h2>
                    <h3>{record.total} ({record.count})</h3>
                </div>
                <div class="scores">
                    {#each record.scores.split(",") || [] as score}
                        <div>{score}</div>
                    {/each}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                        class="addScore"
                        onclick={() => {
                            handle.onClkAddBtn(record.playGameId);
                        }}
                    >
                        <Add />
                    </div>
                </div>
            </div>
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
            /*
            height: 3rem;
            line-height: 3rem;
            */
        }

        & > .navigator {
            display: flex;
            overflow-x: auto;
            height: 3rem;
            margin: 0 0.5rem;
            // flex-grow: 1;

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

            & > .gameCard {
                // height: 12rem;
                margin-bottom: 1rem;
                padding: 1rem;
                border: 1px solid gray;
                box-sizing: border-box;
                border-radius: 1rem;
                background-color: #282828;

                & > div {
                    margin-bottom: 0.5rem;
                }

                & > .layout {
                    // height: 40%;
                    height: 3rem;
                    display: flex;
                    justify-content: space-between;

                    & > .left {
                        display: flex;
                        flex-direction: column;
                        // justify-content: space-between;
                    }
                    & > .more {
                        width: 1.5rem;
                        height: 1.5rem;
                        cursor: pointer;

                        &:active {
                            background-color: black;
                        }

                        & > .moreMenu {
                            background-color: #222222;

                            & > .menu {
                                width: 2rem;
                                height: 2rem;
                            }
                        }
                    }
                }
                & > .memo {
                    width: 100%;
                    // height: 12%;
                    height: 1rem;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                & > .total {
                    // height: 24%;
                    height: 2rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                & > .scores {
                    // height: 24%;
                    width: 100%;
                    height: 2rem;
                    display: flex;
                    overflow: scroll;
                    margin: 0;
                    & > div {
                        height: 100%;
                        min-width: 5rem;
                        border: 1px solid gray;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-sizing: border-box;
                        border-radius: 0.5rem;
                        margin-right: 0.5rem;
                        background-color: #222222;
                    }

                    & > .addScore {
                        cursor: pointer;

                        & > svg {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
</style>
