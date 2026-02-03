<script>
    import {
        Button,
        Column,
        Input,
        InputGroup,
        InputGroupText,
        Table,
    } from "@sveltestrap/sveltestrap";
    import {
        gameState,
        memberState,
        bettingState,
    } from "../state/state.svelte";
    import { getUserInfo } from "../state/utils.svelte";

    const game = {
        bet1: "game2",
        bet2: "game3",
        bet3: "game4",
    };

    let { joiner, currentBet } = $props();

    let sortedJoiner = $derived.by(() => {
        const temp = joiner.map((v) => {
            const userInfo = getUserInfo(v["회원번호"]);
            return { ...v, handicap: userInfo["핸디캡"] };
        });

        return [...temp]
            .sort((a, b) => {
                const ap = a.handicap + a[game[currentBet]];
                const bp = b.handicap + b[game[currentBet]];

                return bp - ap;
            })
            .map((v, i) => {
                return {
                    index: i + 1,
                    ...v,
                    prize:
                        joiner.length < 3
                            ? "0"
                            : bettingState.prize[`p${joiner.length}`][
                                  `g${i + 1}`
                              ],
                };
            });
    });

    $inspect(sortedJoiner);
</script>

<Table rows={sortedJoiner} let:row>
    <Column header="순위" width="4rem">{row["index"]}</Column>
    <Column header="이름" width="8rem">{row["이름"]}</Column>
    <Column header="핸디" width="8rem">{row["handicap"]}</Column>

    <Column header="점수" width="10rem">
        <InputGroup class="flex-nowrap">
            <Input
                class={`${row[game[currentBet]] >= 200 && "score200"} inputGT`}
                value={row[game[currentBet]]}
                disabled
            />
            {#if row["handicap"] !== 0}
                <InputGroupText
                    class={`${row[game[currentBet]] + row["handicap"] >= 200 && "score200"} inputGT`}
                    >{row[game[currentBet]] + row["handicap"]}</InputGroupText
                >
            {/if}
        </InputGroup>
    </Column>
    <Column header="금액">{row["prize"]}</Column>
</Table>
