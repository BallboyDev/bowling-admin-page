<script lang="ts">
    import {
        Badge,
        Button,
        ButtonGroup,
        Column,
        Icon,
        Image,
        Input,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import { onMount } from "svelte";
    import ImageUpload from "./components/ImageUpload.svelte";
    import SaveRecords from "./components/SaveRecords.svelte";

    let scoreList: {
        name: string;
        game1: { score: number | null; confidence: number };
        game2: { score: number | null; confidence: number };
        game3: { score: number | null; confidence: number };
        game4: { score: number | null; confidence: number };
    }[] = $state([
        {
            name: "",
            game1: { score: 0, confidence: 0 },
            game2: { score: 0, confidence: 0 },
            game3: { score: 0, confidence: 0 },
            game4: { score: 0, confidence: 0 },
        },
    ]);
    let imageUploadOpen = $state(false);
    let saveOpen = $state(false);
    let selectImage: File | null = $state(null);
    let previewUrl = $state("");

    const setScore = (game: { score: number | null; confidence: number }) => {
        const { score, confidence } = game;

        // `${(row.game1.confidence || 0) < 95 ? "*" : ""}${row.game1.score || "-"}`

        if (!!score) {
            return confidence < 95 ? `*${score}` : score;
        } else {
            return "-";
        }
    };

    const calcInfo = (
        type: string,
        row: {
            name: string;
            game1: { score: number | null; confidence: number };
            game2: { score: number | null; confidence: number };
            game3: { score: number | null; confidence: number };
            game4: { score: number | null; confidence: number };
        },
    ) => {
        const { game1, game2, game3, game4 } = row;

        const total =
            (game1.score || 0) +
            (game2.score || 0) +
            (game3.score || 0) +
            (game4.score || 0);
        const count =
            (!!game1.score ? 1 : 0) +
            (!!game2.score ? 1 : 0) +
            (!!game3.score ? 1 : 0) +
            (!!game4.score ? 1 : 0);
        const avg = Math.floor(total / count);

        return type === "total" ? total : type === "avg" ? avg : count;
    };
</script>

<div class="w-100">
    <div class="d-flex gap-2 flex-column my-2">
        <!-- my-3 gap-2 justify-content-between -->

        <div class="d-flex justify-content-end gap-2">
            <Button
                color="primary"
                outline
                onclick={() => {
                    imageUploadOpen = true;
                }}><Icon name="camera" /></Button
            >
            <Button
                color="primary"
                outline
                disabled={scoreList.length <= 1}
                onclick={() => {
                    saveOpen = true;
                }}>저장</Button
            >
            <Button color="primary" outline disabled={scoreList.length <= 1}
                >뽑기</Button
            >
            <!-- <Input type="file" name="file" id="exampleFile" /> -->
        </div>
    </div>

    {#if scoreList.length <= 1 && scoreList[0].name === ""}
        <div class="w-100">
            <Image src="public/gbc.png" class="w-100 opacity-50" />
            <h3 class="text-center">게임 등록</h3>
        </div>
    {:else}
        {#each scoreList as row, index}
            <div class="d-flex flex-column border-bottom py-2">
                <div class="mb-2 d-flex justify-content-between">
                    <!-- <span>{row.name}</span> -->
                    <Badge color="primary">{row.name}</Badge>
                    <!-- <span class="ms-3">평균: {calcAvg(row)}</span> -->
                    <div>
                        <Badge color="success">{calcInfo("total", row)}</Badge>
                        <Badge color="warning">{calcInfo("avg", row)}</Badge>
                        <Badge color="info">{calcInfo("count", row)} 게임</Badge
                        >
                    </div>
                </div>
                <div class="d-flex gap-2 justify-content-between">
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${(row.game1.score || 0) >= 200 ? "border-color: var(--bs-red); color: var(--bs-red);" : "border-color: var(--bs-blue); color: var(--bs-blue)"}`}
                        value={setScore(row.game1)}
                        onchange={(e) => {
                            const temp = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            const value = temp > 300 ? 300 : temp;
                            scoreList[index].game1 = {
                                score: value,
                                confidence: 100,
                            };
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${(row.game2.score || 0) >= 200 ? "border-color: var(--bs-red); color: var(--bs-red);" : "border-color: var(--bs-blue); color: var(--bs-blue)"}`}
                        value={setScore(row.game2)}
                        onchange={(e) => {
                            const temp = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            const value = temp > 300 ? 300 : temp;
                            scoreList[index].game2 = {
                                score: value,
                                confidence: 100,
                            };
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${(row.game3.score || 0) >= 200 ? "border-color: var(--bs-red); color: var(--bs-red);" : "border-color: var(--bs-blue); color: var(--bs-blue)"}`}
                        value={setScore(row.game3)}
                        onchange={(e) => {
                            const temp = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            const value = temp > 300 ? 300 : temp;
                            scoreList[index].game3 = {
                                score: value,
                                confidence: 100,
                            };
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${(row.game4.score || 0) >= 200 ? "border-color: var(--bs-red); color: var(--bs-red);" : "border-color: var(--bs-blue); color: var(--bs-blue)"}`}
                        value={setScore(row.game4)}
                        onchange={(e) => {
                            const temp = Number(
                                (e.target as HTMLInputElement).value,
                            );
                            const value = temp > 300 ? 300 : temp;
                            scoreList[index].game4 = {
                                score: value,
                                confidence: 100,
                            };
                        }}
                    />
                </div>
            </div>
        {/each}
    {/if}
</div>

<ImageUpload
    bind:isOpen={imageUploadOpen}
    bind:selectImage
    bind:previewUrl
    bind:scoreList
/>

<SaveRecords bind:isOpen={saveOpen} {scoreList} />
