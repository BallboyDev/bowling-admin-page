<script>
    import { Column, Table } from "@sveltestrap/sveltestrap";
    import { bettingState } from "../state/state.svelte";
    import gasApi from "../gas/gas";
    import { onMount } from "svelte";

    let title = $state([]);
    let prize = $state([]);

    $inspect(title, prize, bettingState.prize);

    onMount(() => {
        // gasApi.getBettingPrize().then((res) => {
        //     bettingState.prize = res;
        // });
    });
</script>

<Table
    rows={(bettingState.prize || []).filter((v) => {
        return v[1] !== "" || !!v[1];
    })}
    let:row
>
    <Column header="순위">{row[0]}</Column>
    <Column header="13명">{row[1] || ""}</Column>
    <Column header="12명">{row[2] || ""}</Column>
    <Column header="11명">{row[3] || ""}</Column>
    <Column header="10명">{row[4] || ""}</Column>
    <Column header="9명">{row[5] || ""}</Column>
    <Column header="8명">{row[6] || ""}</Column>
    <Column header="7명">{row[7] || ""}</Column>
    <Column header="6명">{row[8] || ""}</Column>
    <Column header="5명">{row[9] || ""}</Column>
    <Column header="4명">{row[10] || ""}</Column>
    <Column header="3명">{row[11] || ""}</Column>
</Table>
