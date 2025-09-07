<script>
    // @ts-nocheck
    import { PUBLIC_API_URL } from "$env/static/public";
    import { Button, Input } from "@sveltestrap/sveltestrap";
    import axios from "axios";
    import { onMount } from "svelte";

    const { selectedScore, onCancel } = $props();

    let score = $state(0);

    onMount(() => {
        score = selectedScore.score;
    });

    const handle = {
        onUpdate: () => {
            callApi.updateScore();
        },
    };
    const callApi = {
        updateScore: async () => {
            console.log(score, selectedScore.score);
            if (score !== selectedScore.score) {
                console.log("ballboy callApi");

                await axios
                    .post(`${PUBLIC_API_URL}/bap/scoreRecord/updateScore`, {
                        id: selectedScore.id,
                        score,
                    })
                    .then((res) => {
                        console.log(res);
                        onCancel();
                    });
            }
        },
    };
</script>

<div
    id="popup-updateScore"
    class="position-fixed fixed-top d-flex w-100 h-100 justify-content-center align-items-center"
>
    <div class="inputBox p-3 rounded-4 d-flex flex-column">
        <Input class="mb-3" type="number" bind:value={score} />
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
                onclick={() => {
                    handle.onUpdate();
                }}
                color="primary"
                outline
                children="수정"
            />
        </div>
    </div>
</div>

<style lang="scss">
    #popup-updateScore {
        background-color: rgba(0, 0, 0, 0.4);

        & > .inputBox {
            width: 15rem;
            border: 1px solid gray;
            background-color: #222222;
        }
    }
</style>
