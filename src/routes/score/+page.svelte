<script>
    // @ts-nocheck

    import { browser } from "$app/environment";

    // @ts-nocheck

    import { PUBLIC_API_URL } from "$env/static/public";
    import axios from "axios";
    import dayjs from "dayjs";
    import { onMount } from "svelte";

    let records = $state({});
    let popupAddScore = $state(false);

    let userInfo = $state("");

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

    const handle = {
        onAddBtn: () => {
            popupAddScore = true;
            console.log("onCLickAddBtn()");
        },
        onMoreBtn: () => {
            console.log("onMoreBtn()");
        },
    };

    const callApi = {
        getScore: async () => {
            await axios
                .get(`${PUBLIC_API_URL}/bap/scoreRecord/1`)
                .then((res) => {
                    console.log(res.data);
                    records = res.data;
                });
        },
    };
</script>

{#if popupAddScore}
    <div class="popup-addScore">
        <div class="inputBox">
            <input type="number" />
            <div class="btn">
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="add"
                    onclick={() => {
                        popupAddScore = false;
                    }}
                >
                    add
                </div>
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div
                    class="cancel"
                    onclick={() => {
                        popupAddScore = false;
                    }}
                >
                    cancel
                </div>
            </div>
        </div>
    </div>
{/if}

<div id="tempPage">
    <div class="title">
        <h1>양승우 (12345 / {userInfo})</h1>
    </div>
    <!-- <Title title="양승우" /> -->

    <div class="navigator">
        <div class="navi">HOME</div>
        <div class="navi">회원정보수정</div>
        <div class="navi">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height="1.5rem"
                viewBox="0 -960 960 960"
                width="1.5rem"
                fill="#FFFFFF"
                ><path
                    d="M200-160v-280h-80v-80h240v80h-80v280h-80Zm0-440v-200h80v200h-80Zm160 0v-80h80v-120h80v120h80v80H360Zm80 440v-360h80v360h-80Zm240 0v-120h-80v-80h240v80h-80v120h-80Zm0-280v-360h80v360h-80Z"
                /></svg
            >
        </div>
        <div class="navi">navi----4</div>
        <div class="navi">navi-----5</div>
        <div class="navi">navi------6</div>
    </div>

    <div class="contents">
        <!-- 일시, 장소, 총점, 평균, 메모 -->
        {#each records as record}
            <div class="card">
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
                            handle.onMoreBtn();
                        }}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            fill="#FFFFFF"
                            ><path
                                d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"
                            /></svg
                        >
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
                    <div class="addScore" onclick={handle.onAddBtn}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 -960 960 960"
                            fill="#FFFFFF"
                            width="100vh"
                            ><path
                                d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"
                            /></svg
                        >
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
            height: 3rem;
            line-height: 3rem;
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

                background-color: #282828;
            }
        }

        & > .contents {
            padding: 1rem 0;
            margin: 0 1rem;
            flex: 1;

            overflow: scroll;

            & > .card {
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

    .popup-addScore {
        position: absolute;
        display: flex;
        width: 100%;
        height: 100%;

        background-color: rgba(0, 0, 0, 0.4);
        align-items: center;
        justify-content: center;

        & > .inputBox {
            width: 15rem;
            // height: 6rem;

            padding: 1rem;
            border: 1px solid gray;
            border-radius: 1rem;

            background-color: #222222;
            display: flex;
            flex-direction: column;
            & > input {
                height: 2rem;
                margin-bottom: 1rem;
                font-size: 1.5rem;
                text-align: center;
                border-radius: 0.5rem;
            }

            & > .btn {
                height: 2rem;
                display: flex;

                & > div {
                    width: 50%;
                    border: 1px solid gray;
                    border-radius: 0.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                & > .add {
                    margin-right: 0.5rem;
                    background-color: rgba(0, 0, 255, 0.3);
                }
                & > .cancel {
                    background-color: rgba(255, 0, 0, 0.3);
                }
            }
        }
    }
</style>
