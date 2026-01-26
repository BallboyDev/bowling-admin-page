<script>
    import {
        Badge,
        Button,
        Column,
        Input,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { gameState } from "../state/state.svelte";

    let { isOpen = $bindable(), selectedRegularGame = $bindable() } = $props();

    // $inspect(selectedRegularGame);

    const selectGame = (game) => {
        const exsist = selectedRegularGame.findIndex((v) => {
            return v.title === game.title;
        });

        if (exsist === -1) {
            selectedRegularGame = [...selectedRegularGame, game];
        } else {
            selectedRegularGame = selectedRegularGame.filter((v) => {
                return v.title !== game.title;
            });
        }

        console.log(selectedRegularGame.length);
    };
</script>

<Modal bind:isOpen size="lg">
    <ModalHeader>정기전 기록</ModalHeader>
    <ModalBody>
        <Table rows={gameState.gameList} let:row>
            <Column header="" width="3rem">
                <Input
                    type="checkbox"
                    checked={selectedRegularGame.some((v) => {
                        return v.title === row.title;
                    })}
                    onchange={() => {
                        selectGame(row);
                    }}
                />
            </Column>
            <Column header="이름" width="6rem">
                {row.title}
            </Column>
            <Column header="인원수" width="4rem">
                {row.count}
            </Column>
            <Column header="참여 인원">
                {#each Object.keys(row) as item}
                    {#if item !== "title" && item !== "count"}
                        <Badge class="me-1" color="primary" pill>{item}</Badge>
                    {/if}
                {/each}
            </Column>
        </Table>
    </ModalBody>
    <ModalFooter>
        <Button
            color="primary"
            onclick={() => {
                isOpen = !isOpen;
            }}>확인</Button
        >
    </ModalFooter>
</Modal>
