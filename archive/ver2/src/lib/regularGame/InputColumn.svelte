<script lang="ts">
    import {
        Button,
        Column,
        Input,
        InputGroup,
        InputGroupText,
    } from "@sveltestrap/sveltestrap";

    import gasApi from "../gas/gas";
    import { memberState } from "../state/state.svelte";

    const { changeTeam, row, updateStatus } = $props();

    let point1 = $state(0);
    let point2 = $state(0);
    let point3 = $state(0);
    let point4 = $state(0);

    let rowInfo = $state({});

    let totalScore = $derived(point1 + point2 + point3 + point4);
    let avgScore = $derived.by(() => {
        const checkZero = (n) => (n === 0 ? 0 : 1);
        let deno =
            checkZero(point1) +
            checkZero(point2) +
            checkZero(point3) +
            checkZero(point4);

        return deno === 0 ? 0 : totalScore / deno;
    });

    $effect(() => {
        point1 = row?.game1 || 0;
        point2 = row?.game2 || 0;
        point3 = row?.game3 || 0;
        point4 = row?.game4 || 0;
    });

    $effect(() => {
        rowInfo = memberState.memberList.find((v) => {
            return `${v["회원번호"]}` === `${row?.회원번호}`;
        });
    });

    const inputScore = (currentScore: number, point, game) => {
        if (`${point}` !== `${currentScore}`) {
            gasApi
                .updateScore(row["회원번호"], game, currentScore)
                .then((res) => {
                    // console.log(res);
                    // point = res.data.changeScore;
                    if (game === "game1") {
                        point1 = res.data.changeScore;
                    } else if (game === "game2") {
                        point2 = res.data.changeScore;
                    } else if (game === "game3") {
                        point3 = res.data.changeScore;
                    } else if (game === "game4") {
                        point4 = res.data.changeScore;
                    }
                });
        }
    };
</script>

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
<Column header="Game 1">
    <InputGroup class="flex-nowrap">
        <Input
            type="number"
            placeholder="score"
            disabled={updateStatus}
            value={point1}
            class={`${point1 >= 200 && "score200"} inputGT`}
            onblur={(e) => {
                inputScore(e.target.value, point1, "game1");
            }}
            onfocusin={() => {}}
        />
        {#if !!rowInfo && rowInfo["핸디캡"] !== 0 && point1 !== 0}
            <InputGroupText
                class={`${point1 + rowInfo["핸디캡"] >= 200 && "score200"} inputGT`}
                >{point1 + rowInfo["핸디캡"]}</InputGroupText
            >
        {/if}
    </InputGroup>
</Column>
<Column header="Game 2">
    <InputGroup class="flex-nowrap">
        <Input
            type="number"
            placeholder="score"
            disabled={updateStatus}
            value={point2}
            class={`${point2 >= 200 && "score200"} inputGT`}
            onblur={(e) => {
                inputScore(e.target.value, point2, "game2");
            }}
        />
        {#if !!rowInfo && rowInfo["핸디캡"] !== 0 && point2 !== 0}
            <InputGroupText
                class={`${point2 + rowInfo["핸디캡"] >= 200 && "score200"} inputGT`}
                >{point2 + rowInfo["핸디캡"]}</InputGroupText
            >
        {/if}
    </InputGroup>
</Column>
<Column header="Game 3">
    <InputGroup class="flex-nowrap">
        <Input
            type="number"
            placeholder="score"
            disabled={updateStatus}
            value={point3}
            class={`${point3 >= 200 && "score200"} inputGT`}
            onblur={(e) => {
                inputScore(e.target.value, point3, "game3");
            }}
        />
        {#if !!rowInfo && rowInfo["핸디캡"] !== 0 && point3 !== 0}
            <InputGroupText
                class={`${point3 + rowInfo["핸디캡"] >= 200 && "score200"} inputGT`}
                >{point3 + rowInfo["핸디캡"]}</InputGroupText
            >
        {/if}
    </InputGroup>
</Column>
<Column header="Game 4">
    <InputGroup class="flex-nowrap">
        <Input
            type="number"
            placeholder="score"
            disabled={updateStatus}
            value={point4}
            class={`${point4 >= 200 && "score200"} inputGT`}
            onblur={(e) => {
                inputScore(e.target.value, point4, "game4");
            }}
        />
        {#if !!rowInfo && rowInfo["핸디캡"] !== 0 && point4 !== 0}
            <InputGroupText
                class={`${point4 + rowInfo["핸디캡"] >= 200 && "score200"} inputGT`}
                >{point4 + rowInfo["핸디캡"]}</InputGroupText
            >
        {/if}
    </InputGroup>
</Column>
<Column header="총점">{totalScore}</Column>
<Column header="평균">{avgScore}</Column>

<style>
    :global(.score200) {
        color: var(--bs-code-color);
    }
    :global(.inputGT) {
        min-width: 4rem !important;
    }
</style>
