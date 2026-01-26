<script>
    import { Column, Table } from "@sveltestrap/sveltestrap";
    const game = {
        bet1: "game2",
        bet2: "game3",
        bet3: "game4",
    };

    let { joiner, currentBet } = $props();

    let sortedJoiner = $derived.by(() => {
        return [...joiner]
            .sort((a, b) => {
                return b[game[currentBet]] - a[game[currentBet]];
            })
            .map((v, i) => {
                return { index: i + 1, ...v };
            });
    });
</script>

<Table rows={sortedJoiner} let:row>
    <Column header="순위">{row["index"]}</Column>
    <Column header="이름">{row["이름"]}</Column>
    <Column header="점수">{row[game[currentBet]]}</Column>
    <Column header="금액">금액</Column>
</Table>
