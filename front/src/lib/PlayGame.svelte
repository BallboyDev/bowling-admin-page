<script lang="ts">
    import {
        Badge,
        Button,
        ButtonGroup,
        Column,
        Icon,
        Input,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import { onMount } from "svelte";

    let scoreList = $state([
        { name: "", game1: 0, game2: 0, game3: 0, game4: 0, average: "" },
    ]);

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

        <div class="d-flex justify-content-end gap-2">
            <!-- <Button color="primary" outline><Icon name="camera" /></Button>
            <Button color="primary" outline>저장</Button>
            <Button color="primary" outline>뽑기</Button> -->
            <Input type="file" name="file" id="exampleFile" />
            <input type="file" accept="image/*" capture="user" />
        </div>
    </div>

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
