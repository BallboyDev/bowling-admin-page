<script>
    // @ts-nocheck

    import Add from "$lib/images/Add.svelte";
    import Change from "$lib/images/Change.svelte";
    import Close from "$lib/images/Close.svelte";
    import More from "$lib/images/More.svelte";
    import dayjs from "dayjs";
    import SelectBtn from "../../components/SelectBtn.svelte";
    import AddScore from "./AddScore.svelte";
    import axios from "axios";
    import { PUBLIC_API_URL } from "$env/static/public";
    import Delete from "$lib/images/Delete.svelte";
    import RegistGame from "./RegistGame.svelte";
    import { onMount } from "svelte";
    import UpdateScore from "./UpdateScore.svelte";

    const { record, memberNum, reloadScore } = $props();

    let cardMore = $state(false);
    let selectBtn = $state(false);
    let popupAddScore = $state(false);
    let popupClose = $state(false);
    let popupModify = $state(false);
    let popupScore = $state(false);

    let selectedScore = $state({});

    onMount(() => {});

    // $effect(() => {
    //     if (!popupScore) {
    //         selectedScore = {};
    //     }
    // });

    const handle = {
        onClkCloseBtn: () => {
            cardMore = !cardMore;
            selectBtn = true;
            popupClose = true;
        },
        onClkUpdateBtn: () => {
            cardMore = !cardMore;
            selectBtn = true;
            popupModify = true;
        },
        onScoreUpdate: (score) => {
            selectedScore = score;
            popupScore = true;
        },
    };

    const callApi = {
        deletePlayGame: async () => {
            await axios
                .delete(
                    `${PUBLIC_API_URL}/bap/scoreRecord/deletePlayGame/${record.playGameId}`,
                )
                .then((res) => {
                    console.log(res);
                });
        },
    };
</script>

{#if popupAddScore}
    <AddScore
        cardId={record.playGameId}
        onClose={() => {
            popupAddScore = false;
            reloadScore();
        }}
    />
{/if}

{#if popupClose}
    <SelectBtn
        text="게임을 삭제 하시겠습니까?"
        btnList={[
            {
                text: "취소",
                color: "danger",
                onClick: () => {
                    selectBtn = false;
                    popupClose = false;
                },
            },
            {
                text: "확인",
                color: "primary",
                onClick: async () => {
                    selectBtn = false;
                    popupClose = false;

                    await callApi.deletePlayGame();
                    await reloadScore();
                },
            },
        ]}
    />
{/if}

{#if popupModify}
    <RegistGame
        onCancel={() => {
            popupModify = false;
        }}
        getScore={() => {
            reloadScore();
        }}
        {memberNum}
        updateData={record}
    />
{/if}

{#if popupScore}
    <UpdateScore
        {selectedScore}
        onCancel={() => {
            popupScore = false;
            reloadScore();
        }}
    />
{/if}

<div id="gameCard">
    <div class="layout">
        <div class="left">
            <div class="place">{record.place}</div>
            <h2 class="date">
                {dayjs(record.date).format("YYYY.MM.DD (ddd)")}
            </h2>
        </div>

        <div class="moreBox d-flex flex-row-reverse">
            <button
                class="more"
                onclick={() => {
                    cardMore = !cardMore;
                }}
            >
                <More />
            </button>
            {#if cardMore}
                <button
                    class="more"
                    onclick={() => {
                        handle.onClkCloseBtn();
                    }}><Delete /></button
                >
                <button
                    class="more"
                    onclick={() => {
                        handle.onClkUpdateBtn();
                    }}><Change /></button
                >
            {/if}
        </div>
    </div>
    <div class="memo">-</div>
    <div class="total">
        <h2>{Math.round(record.avg * 10) / 10}</h2>
        <h3>{record.total} ({record.count} game)</h3>
    </div>
    <div class="scores">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <button
            class="addScore score"
            onclick={() => {
                popupAddScore = true;
            }}
        >
            <Add />
        </button>
        {#each record.scores || [] as s}
            <button
                class="score"
                onclick={() => {
                    handle.onScoreUpdate(s);
                }}>{s.score}</button
            >
        {/each}
    </div>
</div>

<style lang="scss">
    #gameCard {
        margin-bottom: 1rem;
        padding: 1rem;
        border: 1px solid gray;
        box-sizing: border-box;
        border-radius: 1rem;
        background-color: #282828;

        & * {
            scrollbar-width: none;
        }

        & > div {
            margin-bottom: 0.5rem;
        }

        & > .layout {
            height: 3rem;
            display: flex;
            justify-content: space-between;

            & > .left {
                display: flex;
                flex-direction: column;
            }

            & > .moreBox {
                & > .more {
                    margin-left: 0.5rem;
                    width: 1.5rem;
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border: 0;
                    background-color: inherit;

                    &:active {
                        background-color: black;
                    }
                }
            }
        }
        & > .memo {
            width: 100%;
            height: 1rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        & > .total {
            height: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }
        & > .scores {
            width: 100%;
            height: 2rem;
            display: flex;
            overflow: scroll;
            margin: 0;
            & > .score {
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

                color: #cccccc;
            }

            & > .addScore {
                width: 2rem !important;
                min-width: 2rem;
                cursor: pointer;
            }
        }
    }
</style>
