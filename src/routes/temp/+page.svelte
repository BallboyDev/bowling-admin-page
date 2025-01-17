<script>
    // @ts-nocheck

    import { PUBLIC_API_URL } from "$env/static/public";
    import axios from "axios";
    import dayjs from "dayjs";
    import { onMount } from "svelte";

    const temp = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    let records = $state({});

    onMount(() => {
        axios.get(`${PUBLIC_API_URL}/bap/scoreRecord/1`).then((res) => {
            console.log(res.data);
            records = res.data;
        });
    });
</script>

<div id="tempPage">
    <div class="title">
        <h1>양승우 (12345)</h1>
    </div>

    <div class="navigator">
        <div class="navi">navi-1</div>
        <div class="navi">navi--2</div>
        <div class="navi">navi---3</div>
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
                    <div class="add">+</div>
                </div>
                <div class="memo">-</div>
                <div class="total">
                    <h2>{record.avg}</h2>
                    <h3>{record.total} ({record.count})</h3>
                </div>
                <div class="scores">
                    {#each record.scores.split(",") || [] as score}
                        <div>{score}</div>
                    {/each}
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
                    & > .add {
                        width: 3rem;
                        height: 3rem;
                        text-align: right;
                        font-size: 2.5rem;
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
                    }
                }
            }
        }
    }
</style>
