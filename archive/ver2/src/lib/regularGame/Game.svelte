<script>
    import { Button, Column, Input, Table } from "@sveltestrap/sveltestrap";
    import { gameState, authState } from "../state/state.svelte";
    import gasApi from "../gas/gas";
    import UpsertGame from "./UpsertGame.svelte";
    import InputColumn from "./InputColumn.svelte";
    import PageTitle from "../common/PageTitle.svelte";

    let gameTitle = $state("");
    let pattern = $state("");
    let updateStatus = $state(false);
    let gameScores = $state([]);

    let upsertGameIsOpen = $state(false);

    $effect(() => {
        gameTitle = gameState.lastGame.lastGame;
        pattern = gameState.lastGame.pattern;
        updateStatus = gameState.lastGame.status === "before" ? false : true;
        gameScores = gameState.lastGame.data;
    });

    const newGameSave = () => {
        gasApi.newGameSave();
    };

    const changeTeam = async (row) => {
        gasApi.changeTeam(gameTitle, row["회원번호"]).then((res) => {
            gameScores = res.data;
        });
    };
</script>

<div class="page-member">
    <!-- <h1 class="my-3">{`GBC 정기전 ${gameTitle}`}</h1> -->

    <PageTitle pageTitle={`GBC 정기전 \n${gameTitle}`}></PageTitle>
    <div class="d-flex justify-content-between w-100"></div>

    <div class="btns d-flex justify-content-between w-100">
        <div class="d-flex gap-2">
            <!-- <Input value={lastGame} disabled /> -->
            <Input value={pattern} placeholder="레인 패턴" disabled />
            <Input
                value={`${gameScores.length} 명`}
                placeholder="참여 인원"
                disabled
            />
        </div>
        {#if authState.auth >= 1}
            <div class="d-flex gap-2">
                <Button
                    size="sm"
                    color="primary"
                    disabled={updateStatus}
                    outline
                    onclick={newGameSave}>기록 저장</Button
                >
                <Button
                    size="sm"
                    color="primary"
                    outline
                    onclick={() => {
                        upsertGameIsOpen = !upsertGameIsOpen;
                    }}
                    >{!updateStatus
                        ? "정기전 생성 / 수정"
                        : "정기전 생성"}</Button
                >
            </div>
        {/if}
    </div>

    <div class="table-wrap">
        <Table
            rows={[...gameScores].sort((a, b) => {
                return a.team - b.team;
            })}
            let:row
        >
            <InputColumn {changeTeam} {row} {updateStatus} />
        </Table>
    </div>
</div>

<UpsertGame
    bind:isOpen={upsertGameIsOpen}
    {updateStatus}
    gameData={{
        title: gameTitle,
        pattern: pattern,
        gameRecord: gameScores,
    }}
/>

<style lang="scss">
    :global(.score) {
        width: 100%;
    }

    .page-member {
        width: 100%;

        & > .table-wrap {
            flex-wrap: nowrap;
            overflow-x: auto;
        }
    }

    .btns {
        @media (max-width: 768px) {
            flex-direction: column-reverse;
            gap: 0.5rem;

            & > * {
                justify-content: end;
            }
        }
    }
</style>
