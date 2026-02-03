<script>
    import { Column, Table } from "@sveltestrap/sveltestrap";
    import { bettingState } from "../state/state.svelte";
    import gasApi from "../gas/gas";
    import { onMount } from "svelte";

    let grade = $state([
        "g1",
        "g2",
        "g3",
        "g4",
        "g5",
        "g6",
        "g7",
        "g8",
        "g9",
        "g10",
        "g11",
        "g12",
        "g13",
    ]);
    let prizeSheet = $state({});

    $effect(() => {
        prizeSheet = bettingState.prize;
    });
</script>

<div class="w-100">
    <div class="table-wrap">
        <Table rows={grade} let:row>
            <Column header="순위">{`${row.replace("g", "")} 등`}</Column>
            <Column header="13명">{bettingState.prize.p13[row] || 0}</Column>
            <Column header="12명">{bettingState.prize.p12[row] || 0}</Column>
            <Column header="11명">{bettingState.prize.p11[row] || 0}</Column>
            <Column header="10명">{bettingState.prize.p10[row] || 0}</Column>
            <Column header="9명">{bettingState.prize.p9[row] || 0}</Column>
            <Column header="8명">{bettingState.prize.p8[row] || 0}</Column>
            <Column header="7명">{bettingState.prize.p7[row] || 0}</Column>
            <Column header="6명">{bettingState.prize.p6[row] || 0}</Column>
            <Column header="5명">{bettingState.prize.p5[row] || 0}</Column>
            <Column header="4명">{bettingState.prize.p4[row] || 0}</Column>
            <Column header="3명">{bettingState.prize.p3[row] || 0}</Column>
        </Table>
    </div>
</div>
