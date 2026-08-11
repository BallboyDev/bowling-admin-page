<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Badge,
        Button,
        ButtonGroup,
        Column,
        Icon,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import { onMount } from "svelte";

    let gameList: any[] = $state([]);
    let selectGame = $state({ title: "", title_id: "", pos: 0 });
    let selectPos = $state(0);
    let scoreList = $state([
        { name: "", game1: 0, game2: 0, game3: 0, game4: 0, average: "" },
    ]);

    const getGameList = () => {
        callApi("/api/records/gameList", "GET").then((res) => {
            gameList = res;
            selectGame = {
                ...gameList[gameList.length - 1],
                pos: gameList.length - 1,
            };
            selectPos = gameList.length;
        });
    };

    const getGame = () => {
        callApi(`/api/records/${selectGame.title_id}`, "GET").then((res) => {
            scoreList = res;
        });
    };

    onMount(() => {
        getGameList();
    });

    $effect(() => {
        if (selectGame.title_id !== "") {
            getGame();
        }
    });

    // $inspect(selectGame, selectPos);

    const scoreCheck = (score: number | string) => {
        if (!score || score === "" || score === "-") {
            return "primary";
        }
        const s = `${score}`.split("/");
        return parseInt(s[s.length - 1]) >= 200 ? "danger" : "primary";
    };
</script>

<div class="w-100">
    <div class="d-flex gap-2 flex-column my-2">
        <!-- my-3 gap-2 justify-content-between -->
        <ButtonGroup class="d-flex ">
            <Button
                size="sm"
                color="primary"
                disabled={selectPos === 0}
                onclick={() => {
                    selectPos--;
                    selectGame = gameList.find((v) => {
                        return v.pos === selectPos;
                    });
                }}><Icon name="caret-left" /></Button
            >
            <Button color="light" outline disabled style="width: 10rem;"
                >{selectGame?.title || ""}</Button
            >
            <Button
                size="sm"
                color="primary"
                disabled={selectPos === gameList.length}
                onclick={() => {
                    selectPos++;
                    selectGame = gameList.find((v) => {
                        return v.pos === selectPos;
                    });
                }}><Icon name="caret-right" /></Button
            >
        </ButtonGroup>
    </div>

    <Accordion>
        <AccordionItem
            header={`${selectGame?.title} (${selectGame.title_id}) 상세기록`}
        >
            최고 점수, 뽑기, 금일 평균, 최고 평균, 참석자, 게임수, 패턴 등등
        </AccordionItem>
    </Accordion>

    {#each scoreList as row}
        <div class="d-flex flex-column border-bottom py-2">
            <div class="mb-2">
                <span>{row.name}</span>
                <span class="ms-3">평균: {row.average}</span>
            </div>
            <div class="d-flex gap-2 justify-content-between">
                <Button
                    outline
                    size="sm"
                    color={scoreCheck(row?.game1)}
                    class="flex-grow-1 flex-shrink-1"
                    style="flex-basis: 0; min-width: 0;"
                    >{row?.game1 || "-"}</Button
                >
                <Button
                    outline
                    size="sm"
                    color={scoreCheck(row?.game2)}
                    class="flex-grow-1 flex-shrink-1"
                    style="flex-basis: 0; min-width: 0;"
                    >{row?.game2 || "-"}</Button
                >
                <Button
                    outline
                    size="sm"
                    color={scoreCheck(row?.game3)}
                    class="flex-grow-1 flex-shrink-1"
                    style="flex-basis: 0; min-width: 0;"
                    >{row?.game3 || "-"}</Button
                >
                <Button
                    outline
                    size="sm"
                    color={scoreCheck(row?.game4)}
                    class="flex-grow-1 flex-shrink-1"
                    style="flex-basis: 0; min-width: 0;"
                    >{row?.game4 || "-"}</Button
                >
            </div>
        </div>
    {/each}
</div>
