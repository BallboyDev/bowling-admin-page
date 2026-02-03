<script lang="ts">
    import {
        Column,
        Button,
        TabContent,
        Table,
        TabPane,
    } from "@sveltestrap/sveltestrap";
    import { gameState, memberState } from "../state/state.svelte";
    import Joiner from "./Joiner.svelte";
    import gasApi from "../gas/gas";
    import Prize from "./Prize.svelte";
    import PageTitle from "../common/PageTitle.svelte";

    let currentBet = $state("bet1");

    let joiner = $state({
        bet1: [],
        bet2: [],
        bet3: [],
    });
    let joinBet = $derived({
        bet1:
            !gameState.lastGame.data.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }) ||
            joiner.bet1.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }),
        bet2:
            !gameState.lastGame.data.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }) ||
            joiner.bet2.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }),
        bet3:
            !gameState.lastGame.data.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }) ||
            joiner.bet3.some((v) => {
                return (
                    `${v["회원번호"]}` === `${localStorage.getItem("number")}`
                );
            }),
    });
    let memberLastGame = $derived.by(() => {
        return gameState.lastGame.data.find((v) => {
            return `${v["회원번호"]}` === localStorage.getItem("number");
        });
    });

    // $inspect(joiner, joinBet, memberLastGame);

    $effect(() => {
        const j = {
            bet1: [],
            bet2: [],
            bet3: [],
        };

        gameState.lastGame.data
            .filter((v) => {
                return v["betting"] !== "" || !!v["betting"];
            })
            .forEach((v1) => {
                `${v1["betting"]}`.split("|").forEach((v2) => {
                    if (v2 === "1") {
                        j["bet1"].push(v1);
                    } else if (v2 === "2") {
                        j["bet2"].push(v1);
                    } else if (v2 === "3") {
                        j["bet3"].push(v1);
                    }
                });
            });

        joiner = j;
    });

    const joinBetting = (game = "all") => {
        // call gas api
        gasApi.joinBetting(game).then((res) => {
            // console.log(res);
        });

        const memberNumber = localStorage.getItem("number");

        if (game === "bet1" || game === "all") {
            if (
                !joiner["bet1"].some((v) => {
                    return `${v["회원번호"]}` === memberNumber;
                })
            ) {
                joiner["bet1"].push(memberLastGame);
            }
        }
        if (game === "bet2" || game === "all") {
            if (
                !joiner["bet2"].some((v) => {
                    return `${v["회원번호"]}` === memberNumber;
                })
            ) {
                joiner["bet2"].push(memberLastGame);
            }
        }
        if (game === "bet3" || game === "all") {
            if (
                !joiner["bet3"].some((v) => {
                    return `${v["회원번호"]}` === memberNumber;
                })
            ) {
                joiner["bet3"].push(memberLastGame);
            }
        }
    };
</script>

<div>
    <PageTitle pageTitle="삼바리">
        {#if currentBet !== "prize"}
            <Button
                size="sm"
                outline
                color="primary"
                disabled={joinBet[currentBet] ||
                    gameState.lastGame.status === "after"}
                onclick={() => {
                    joinBetting(currentBet);
                }}>{joinBet[currentBet] ? "참여중" : "참여하기"}</Button
            >
        {/if}
        <Button
            size="sm"
            outline
            color="primary"
            disabled={(joinBet["bet1"] && joinBet["bet2"] && joinBet["bet3"]) ||
                gameState.lastGame.status === "after"}
            onclick={() => {
                joinBetting("all");
            }}
            >{joinBet["bet1"] && joinBet["bet2"] && joinBet["bet3"]
                ? "모두 참여중"
                : "모두 참여하기"}</Button
        >
    </PageTitle>

    <TabContent
        on:tab={(e) => {
            currentBet = e.detail as string;
        }}
    >
        <TabPane tabId="bet1" tab={`game 1 (${joiner.bet1.length} 명)`} active>
            <Joiner joiner={joiner.bet1} {currentBet} />
        </TabPane>
        <TabPane tabId="bet2" tab={`game 2 (${joiner.bet2.length} 명)`}>
            <Joiner joiner={joiner.bet2} {currentBet} />
        </TabPane>
        <TabPane tabId="bet3" tab={`game 3 (${joiner.bet3.length} 명)`}>
            <Joiner joiner={joiner.bet3} {currentBet} />
        </TabPane>
        <TabPane tabId="prize" tab={`상금 확인`}>
            <Prize />
        </TabPane>
    </TabContent>
</div>
