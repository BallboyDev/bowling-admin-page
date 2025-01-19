<script>
    // @ts-nocheck

    import { PUBLIC_API_URL } from "$env/static/public";
    import { Button, Input } from "@sveltestrap/sveltestrap";
    import axios from "axios";
    import { onMount } from "svelte";

    const { cardId, onClose } = $props();

    let score = $state();

    onMount(() => {});

    const handle = {
        onRegist: async () => {
            await callApi.registScore();
            onClose();
        },
    };

    const callApi = {
        registScore: async () => {
            await axios
                .post(`${PUBLIC_API_URL}/bap/scoreRecord/registScore`, {
                    score,
                    playGameId: cardId,
                })
                .then((res) => {
                    console.log(res.data);
                });
        },
    };
</script>

<div class="popup-addScore">
    <div class="inputBox">
        <Input
            class="mb-3"
            type="number"
            placeholder="점수"
            bind:value={score}
        />
        <div class="d-flex">
            <Button
                class="w-50 me-3"
                children="취소"
                outline
                color="danger"
                onclick={() => {
                    onClose();
                }}
            />
            <Button
                class="w-50"
                children="등록"
                outline
                color="primary"
                onclick={() => {
                    handle.onRegist();
                }}
            />
        </div>
    </div>
</div>

<style lang="scss">
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
        }
    }
</style>
