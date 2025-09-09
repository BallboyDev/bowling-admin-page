<script lang="ts">
    import { onMount } from "svelte";

    let { scores } = $props();
</script>

<table>
    <colgroup>
        <col style={"width:15%"} />
        <col style={"width:17%"} />
        <col style={"width:17%"} />
        <col style={"width:17%"} />
        <col style={"width:17%"} />
        <col style={"width:17%"} />
    </colgroup>
    <thead>
        <tr>
            <th>이름</th>
            <th>Game 1</th>
            <th>Game 2</th>
            <th>Game 3</th>
            <th>Game 4</th>
            <th>평균 점수</th>
        </tr>
    </thead>
    <tbody>
        {#each scores.players as score}
            <tr>
                <th class={score.team ? "down" : "up"}
                    >{score.handicap > 0
                        ? `${score.name} / +${score.handicap}`
                        : score.name}</th
                >
                <td> {score.score1}</td>
                <td> {score.score2}</td>
                <td> {score.score3}</td>
                <td> {score.score4}</td>
                <td
                    >{Math.round(
                        ((score.score2 + score.score3 + score.score4) / 3) * 10,
                    ) / 10}</td
                >
            </tr>
        {/each}
    </tbody>
</table>

<style lang="scss">
    table {
        width: 75%;
        // height: 100%;
    }
    table,
    tr,
    th,
    td {
        border-collapse: collapse;
        border: 1px solid black;
        text-align: center;
    }
    tr {
        height: calc(100% / 12);

        & > .up {
            color: red;
        }
        & > .down {
            color: blue;
        }
    }

    td {
        height: 1.8rem;
    }
</style>
