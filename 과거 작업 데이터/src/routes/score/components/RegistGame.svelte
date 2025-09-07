<script>
    // @ts-nocheck

    import { PUBLIC_API_URL } from "$env/static/public";
    import {
        Button,
        Input,
        InputGroup,
        InputGroupText,
    } from "@sveltestrap/sveltestrap";
    import axios from "axios";
    import dayjs from "dayjs";
    import { onDestroy, onMount } from "svelte";
    import { on } from "svelte/events";

    let { onCancel, getScore, memberNum, updateData = {} } = $props();

    let gameId = $state(null);
    let date = $state(dayjs().format("YYYY-MM-DD"));
    let place = $state("광교진락볼링장");
    let inputScoreList = $state([null]);
    let repeatInputScore = $state(false);
    let isModify = $state(false);

    onMount(() => {
        isModify = Object.keys(updateData).length > 0;
    });

    onDestroy(() => {
        keyListener(); // 이벤트 해제
    });

    $effect(() => {
        if (isModify) {
            gameId = updateData.playGameId;
            date = dayjs(updateData.date).format("YYYY-MM-DD");
            place = updateData.place;
        }
    });

    const keyListener = on(window, "keydown", (e) => {
        // console.log("ballboy >>", e.key, e.code);
    });

    const handle = {
        onRegistGameBtn: async () => {
            await callApi.createPlayGame();
            await getScore();
        },
        onClkModifyGameBtn: async () => {
            await callApi.updatePlayGame();
            await getScore();
        },
    };

    const callApi = {
        updatePlayGame: async () => {
            if (!date || !place) {
                alert("입력 값을 확인해 주세요");
                return;
            }

            await axios
                .post(`${PUBLIC_API_URL}/bap/scoreRecord/updateGame`, {
                    id: gameId,
                    date,
                    place,
                })
                .then((res) => {
                    gameId = null;
                    date = null;
                    place = null;
                });
            onCancel();
        },

        createPlayGame: async () => {
            if (
                !date ||
                !place ||
                inputScoreList.length === 0 ||
                inputScoreList.reduce((a, c) => {
                    return a + c;
                }, 0) <= 0
            ) {
                alert("입력 값을 확인해 주세요");
                return;
            }

            await axios
                .post(`${PUBLIC_API_URL}/bap/scoreRecord/registGame`, {
                    date,
                    place,
                    type: "0",
                    memberNum,
                    inputScoreList,
                })
                .then((res) => {
                    console.log(res.data);
                });
            onCancel();
        },
    };
</script>

<div
    id="popup-registGame"
    class="position-fixed fixed-top d-flex w-100 h-100 justify-content-center align-items-center"
>
    <div class="inputBox">
        <Input class="mb-3" type="date" valid={false} bind:value={date} />
        <Input
            class="mb-3"
            type="text"
            bind:value={place}
            placeholder="볼링장"
        />
        {#if !isModify}
            <div class="inputScore">
                {#each inputScoreList as score, i}
                    <InputGroup class="mb-3">
                        <InputGroupText>{i + 1}</InputGroupText>
                        <Input
                            type="number"
                            placeholder="점수"
                            bind:value={inputScoreList[i]}
                        />
                    </InputGroup>
                {/each}
            </div>
            <Button
                class="mb-3 w-100"
                color="primary"
                children="점수 추가"
                onclick={() => {
                    const lastScore = inputScoreList[inputScoreList.length - 1];

                    if ((lastScore || 0) > 0 && (lastScore || 0) <= 300) {
                        inputScoreList = [...inputScoreList, null];
                    }
                }}
            />
        {/if}

        <div class="d-flex">
            <Button
                class="w-50 me-2"
                onclick={onCancel}
                color="danger"
                outline
                children="취소"
            />
            <Button
                class="w-50"
                onclick={isModify
                    ? handle.onClkModifyGameBtn
                    : handle.onRegistGameBtn}
                color="primary"
                outline
                children={isModify ? "수정" : "생성"}
            />
        </div>
    </div>
</div>

<!-- <Styles /> -->

<style lang="scss">
    #popup-registGame {
        z-index: 9999;

        background-color: rgba(0, 0, 0, 0.4);

        & > .inputBox {
            width: 15rem;

            padding: 1rem;
            border: 1px solid gray;
            border-radius: 1rem;

            background-color: #222222;

            & > .inputScore {
                max-height: 15rem;
                overflow-x: auto;
            }
        }
    }
</style>
