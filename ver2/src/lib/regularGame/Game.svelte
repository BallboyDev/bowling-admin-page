<script>
    import { Button, Column, Input, Table } from "@sveltestrap/sveltestrap";
    import { gameState, memberState, settings } from "../state/state.svelte";
    import gasApi from "../gas/gas";
    import { onMount } from "svelte";
    import UpsertGame from "./UpsertGame.svelte";

    let newGameIsOpen = $state(false);
    let upsertGameIsOpen = $state(false);
    let lastGame = $state(null);
    let pattern = $state("");
    let updateStatus = $state(false);
    let gameRecord = $state([]);

    $effect(() => {
        lastGame = gameState.lastGame.lastGame;
        pattern = gameState.lastGame.pattern;
        updateStatus = gameState.lastGame.status === "before" ? false : true;
        gameRecord = gameState.lastGame.data;
    });

    onMount(() => {});

    const changeTeam = async (row) => {
        gasApi.changeTeam(lastGame, row["회원번호"]).then((res) => {
            gameRecord = res.data;
        });
    };

    const inputScore = async (game, currentScore, row) => {
        const prevScore = gameRecord.find((v) => {
            return v["회원번호"] === row["회원번호"];
        })[game];

        if (`${currentScore}` !== `${prevScore}`) {
            gasApi
                .changeScore(game, row, prevScore, parseInt(`${currentScore}`))
                .then((res) => {
                    gameRecord = res.data.scores;
                });
        }
    };
    const calcAvg = (row) => {
        const sum = row["game1"] + row["game2"] + row["game3"] + row["game4"];
        const div =
            (row["game1"] === 0 ? 0 : 1) +
            (row["game2"] === 0 ? 0 : 1) +
            (row["game3"] === 0 ? 0 : 1) +
            (row["game4"] === 0 ? 0 : 1);

        return div === 0 ? 0 : sum / div;
    };
    const newGameSave = () => {
        console.log("newGameSave");
        gasApi.newGameSave().then((res) => {
            settings();
        });
    };
</script>

<div>
    <h1 class="my-3">{`GBC 정기전 ${lastGame}`}</h1>

    <div class="d-flex justify-content-between w-100">
        <div class="d-flex gap-2">
            <!-- <Input value={lastGame} disabled /> -->
            <Input value={pattern} disabled />
            <Input value={`${gameRecord.length}명`} disabled />
        </div>

        <div class="d-flex gap-2">
            <Button
                color="primary"
                disabled={updateStatus}
                outline
                onclick={newGameSave}>기록 저장</Button
            >
            <Button
                color="primary"
                outline
                onclick={() => {
                    upsertGameIsOpen = !upsertGameIsOpen;
                }}>정기전 생성 / 수정</Button
            >
        </div>
    </div>

    <Table
        rows={[...gameRecord].sort((a, b) => {
            return a.team - b.team;
        })}
        let:row
    >
        <Column header="이름" width="8rem">
            <Button
                color={row["team"] === 1 ? "info" : "warning"}
                outline
                disabled={updateStatus}
                onclick={() => {
                    changeTeam(row);
                }}
            >
                {row["이름"]}
            </Button>
        </Column>
        <Column header="Game 1" width="8rem">
            {#if updateStatus}
                {parseInt(`${row["game1"]}`)}
            {:else}
                <Input
                    class="score"
                    type="number"
                    min={0}
                    max={300}
                    value={parseInt(`${row["game1"]}`)}
                    onblur={(e) => {
                        inputScore("game1", e.target.value, row);
                    }}
                    onkeypress={(e) => {
                        if (e.keyCode === 13) {
                            // inputScore(e.target.value, row);
                        }
                    }}
                />
            {/if}
        </Column>
        <Column header="Game 2" width="8rem">
            {#if updateStatus}
                {parseInt(`${row["game2"]}`)}
            {:else}
                <Input
                    class="score"
                    type="number"
                    min={0}
                    max={300}
                    value={parseInt(`${row["game2"]}`)}
                    onblur={(e) => {
                        inputScore("game2", e.target.value, row);
                    }}
                    onkeypress={(e) => {
                        if (e.keyCode === 13) {
                            // inputScore(e.target.value, row);
                        }
                    }}
                />
            {/if}
        </Column>
        <Column header="Game 3" width="8rem">
            {#if updateStatus}
                {parseInt(`${row["game3"]}`)}
            {:else}
                <Input
                    class="score"
                    type="number"
                    min={0}
                    max={300}
                    value={parseInt(`${row["game3"]}`)}
                    onblur={(e) => {
                        inputScore("game3", e.target.value, row);
                    }}
                    onkeypress={(e) => {
                        if (e.keyCode === 13) {
                            // inputScore(e.target.value, row);
                        }
                    }}
                />
            {/if}
        </Column>
        <Column header="Game 4" width="8rem">
            {#if updateStatus}
                {parseInt(`${row["game4"]}`)}
            {:else}
                <Input
                    class="score"
                    type="number"
                    min={0}
                    max={300}
                    value={parseInt(`${row["game4"]}`)}
                    onblur={(e) => {
                        inputScore("game4", e.target.value, row);
                    }}
                    onkeypress={(e) => {
                        if (e.keyCode === 13) {
                            // inputScore(e.target.value, row);
                        }
                    }}
                />
            {/if}
        </Column>
        <Column header="총점">
            {row["game1"] + row["game2"] + row["game3"] + row["game4"]}
        </Column>
        <Column header="평균">
            {calcAvg(row)}
            <!-- {(row["game1"] + row["game2"] + row["game3"] + row["game4"]) / 4} -->
        </Column>
    </Table>
</div>

<UpsertGame
    bind:isOpen={upsertGameIsOpen}
    {updateStatus}
    gameData={{
        title: lastGame,
        pattern: pattern,
        gameRecord: gameRecord,
    }}
/>

<style>
    :global(.score) {
        width: 100%;
    }
</style>
