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

    type ScoreRow = {
        name: string;
        game1: number | string;
        game2: number | string;
        game3: number | string;
        game4: number | string;
        avg: string;
    };

    let scoreList: ScoreRow[] = $state([
        { name: "", game1: 0, game2: 0, game3: 0, game4: 0, avg: "" },
    ]);
    let imageUploadOpen = $state(false);
    let selectImage: File | null = $state(null);
    let previewUrl = $state("");

    const scoreCheck = (score: number | string) => {
        if (!score || score === "" || score === "-") {
            return "primary";
        }
        const s = `${score}`.split("/");
        // return parseInt(s[s.length - 1]) >= 200 ? "danger" : "primary";

        return parseInt(s[s.length - 1]) >= 200
            ? "border-color: var(--bs-red); color: var(--bs-red);"
            : "border-color: var(--bs-blue); color: var(--bs-blue)";
    };

    const changeScore = (
        index: number,
        game: "game1" | "game2" | "game3" | "game4",
        score: string,
    ) => {
        const temp = scoreList[index];

        temp[game] = score;

        scoreList[index] = temp;
    };

    $inspect(scoreList);
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
                    console.log("save", scoreList);
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
                <div class="mb-2">
                    <span>{row.name}</span>
                    <span class="ms-3">평균: {row.avg}</span>
                </div>
                <div class="d-flex gap-2 justify-content-between">
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${scoreCheck(row.game1)}`}
                        value={row.game1}
                        onchange={(e) => {
                            const value = (e.target as HTMLInputElement).value;
                            changeScore(index, "game1", value);
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${scoreCheck(row.game2)}`}
                        value={row.game2}
                        onchange={(e) => {
                            const value = (e.target as HTMLInputElement).value;
                            changeScore(index, "game2", value);
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${scoreCheck(row.game3)}`}
                        value={row.game3}
                        onchange={(e) => {
                            const value = (e.target as HTMLInputElement).value;
                            changeScore(index, "game3", value);
                        }}
                    />
                    <Input
                        type="text"
                        class="flex-grow-1 flex-shrink-1 text-center"
                        style={`flex-basis: 0; min-width: 0; ${scoreCheck(row.game4)}`}
                        value={row.game4}
                        onchange={(e) => {
                            const value = (e.target as HTMLInputElement).value;
                            changeScore(index, "game4", value);
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
