<script>
    // @ts-nocheck

    import { PUBLIC_API_URL } from "$env/static/public";
    import { Button, Input } from "@sveltestrap/sveltestrap";
    import axios from "axios";
    import dayjs from "dayjs";
    import { onMount } from "svelte";

    let { onCancel, getScore, memberNum, updateData = {} } = $props();

    let gameId = $state(null);
    let date = $state(dayjs().format("YYYY-MM-DD"));
    let place = $state("광교진락볼링장");
    let initScore = $state();
    let repeatInputScore = $state(false);
    let isModify = $state(false);

    onMount(() => {
        isModify = Object.keys(updateData).length > 0;
    });

    $effect(() => {
        console.log(isModify);
        if (isModify) {
            gameId = updateData.playGameId;
            date = dayjs(updateData.date).format("YYYY-MM-DD");
            place = updateData.place;
        }
    });

    const handle = {
        onClkRegistGameBtn: async () => {
            await callApi.createPlayGame();
            await getScore();
        },
        onClkModifyGameBtn: async () => {
            console.log("onClkModifyGameBtn");
            await callApi.updatePlayGame();
            await getScore();
        },
    };

    const callApi = {
        createPlayGame: async () => {
            if (!date || !place || !initScore || initScore === 0) {
                alert("입력 값을 확인해 주세요");
                return;
            }

            // await axios
            //     .post(`${PUBLIC_API_URL}/bap/scoreRecord/registGame`, {
            //         date,
            //         place,
            //         type: "0",
            //         memberNum,
            //         initScore,
            //     })
            //     .then((res) => {
            //         console.log(res.data);
            //     });
            onCancel();
        },
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
                    console.log(res.data);
                    gameId = null;
                    date = null;
                    place = null;
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
            <Input
                class="mb-3"
                type="checkbox"
                label="점수 연속 입력"
                bind:checked={repeatInputScore}
            />
            <Input
                class="mb-3"
                type="number"
                bind:value={initScore}
                placeholder="점수"
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
                    : handle.onClkRegistGameBtn}
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
        }
    }
</style>
