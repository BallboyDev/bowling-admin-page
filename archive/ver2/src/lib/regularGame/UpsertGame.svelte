<script>
    import {
        Button,
        Column,
        Input,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        TabContent,
        Table,
        TabPane,
    } from "@sveltestrap/sveltestrap";
    import { memberState, settings } from "../state/state.svelte";
    import gasApi from "../gas/gas";
    import { onMount } from "svelte";

    let { isOpen = $bindable(), updateStatus, gameData } = $props();

    let title = $state("");
    let pattern = $state("");
    let memberList = $state([]);
    let guestList = $state([]);
    let guestName = $state("");

    let backup = $state([]);

    let init = $state(false);

    $inspect(backup).with((type, backup) => {
        if (type === "update") {
            console.log("backup >>", backup);
        }
    });
    $inspect(memberList).with((type, memberList) => {
        if (type === "update") {
            console.log("memberList >>", memberList);
        }
    });
    $inspect(guestList).with((type, guestList) => {
        if (type === "update") {
            console.log("guestList >>", guestList);
        }
    });

    $effect(() => {
        if (isOpen && !updateStatus) {
            title = gameData.title;
            pattern = gameData.pattern;

            const p = [];
            const g = [];
            for (const item of gameData.gameRecord) {
                // console.log(item);
                if (`${item["회원번호"]}`.indexOf("guest") >= 0) {
                    g.push(item);
                } else {
                    p.push(item);
                }
            }

            memberList = p;
            guestList = g;
        }
    });

    const selectMember = (item) => {
        const exsist = memberList.findIndex((v) => {
            return v["회원번호"] === item["회원번호"];
        });
        if (exsist >= 0) {
            backup.push(memberList[exsist]);
            // memberList = memberList.filter((v) => {
            //     return v["회원번호"] !== item["회원번호"];
            // });

            memberList.splice(exsist, 1);
        } else {
            const exsistBackup = backup.findIndex((v) => {
                return v["회원번호"] === item["회원번호"];
            });

            console.log(exsistBackup);

            let player = null;
            if (exsistBackup >= 0) {
                player = backup[exsistBackup];
                backup.splice(exsistBackup, 1);
            } else {
                player = {
                    회원번호: item["회원번호"],
                    team: 1,
                    batting: "",
                    이름: item["이름"],
                    game1: 0,
                    game2: 0,
                    game3: 0,
                    game4: 0,
                    sum: 0,
                    avg: 0,
                };
            }
            memberList.push(player);
        }
    };

    const createNewGame = () => {
        gasApi.createNewGame(title, pattern, memberList, guestList);
    };
</script>

<Modal bind:isOpen>
    <ModalHeader>정기전 생성 / 수정</ModalHeader>
    <ModalBody>
        <div class="d-flex gap-2 mb-2">
            <Input placeholder="정기전 이름" bind:value={title} class="" />
            <!-- 패턴 -->
            <Input placeholder="패턴" bind:value={pattern} />
        </div>
        <div class="modalTable overflow-scroll">
            <TabContent>
                <TabPane
                    tabId="total"
                    tab={`총 인원 (${memberList.length + guestList.length})`}
                    disabled
                ></TabPane>
                <TabPane
                    tabId="member"
                    tab={`회원 (${memberList.length})`}
                    active
                >
                    <Table rows={memberState.memberList} let:row>
                        <Column header="" width="4rem">
                            <Input
                                type="checkbox"
                                checked={memberList.some((v) => {
                                    return v["회원번호"] === row["회원번호"];
                                })}
                                onchange={() => {
                                    selectMember(row);
                                }}
                            />
                        </Column>
                        <Column header="이름">
                            {row["이름"]}
                        </Column>
                        <Column header="평균점수">
                            {row["평균점수"]}
                        </Column>
                    </Table>
                </TabPane>
                <TabPane tabId="guest" tab={`게스트 (${guestList.length})`}>
                    <div class="d-flex gap-2 w-100 my-2">
                        <Input
                            placeholder="게스트 이름"
                            class="w-100"
                            bind:value={guestName}
                            onkeypress={(e) => {
                                if (e.keyCode === 13) {
                                    guestList.push({
                                        회원번호: `guest_${new Date().getTime()}`,
                                        team: 1,
                                        batting: "",
                                        이름: guestName,
                                        game1: 0,
                                        game2: 0,
                                        game3: 0,
                                        game4: 0,
                                        sum: 0,
                                        avg: 0,
                                    });
                                    guestName = "";
                                }
                            }}
                        />
                        <Button
                            class="guestBtn"
                            onclick={() => {
                                guestList.push({
                                    회원번호: `guest_${new Date().getTime()}`,
                                    team: 1,
                                    batting: "",
                                    이름: guestName,
                                    game1: 0,
                                    game2: 0,
                                    game3: 0,
                                    game4: 0,
                                    sum: 0,
                                    avg: 0,
                                });
                                guestName = "";
                            }}>등록</Button
                        >
                    </div>

                    {#each guestList as item}
                        <Button
                            class="mx-1"
                            color="primary"
                            onclick={() => {
                                guestList = guestList.filter((v) => {
                                    return v["회원번호"] !== item["회원번호"];
                                });
                            }}>{item["이름"]}</Button
                        >
                    {/each}
                </TabPane>
            </TabContent>
        </div>
    </ModalBody>
    <ModalFooter>
        <Button
            onclick={() => {
                isOpen = false;
            }}>닫기</Button
        >
        <Button
            onclick={() => {
                title = "";
                pattern = "";
                memberList = [];
                guestList = [];
                guestName = "";
                backup = [];
                init = true;
            }}>초기화</Button
        >
        <Button
            color="primary"
            onclick={() => {
                isOpen = false;
                createNewGame();
            }}>{updateStatus || init ? "생성" : "수정"}</Button
        >
    </ModalFooter>
</Modal>

<style>
    .modalTable {
        height: 60vh;
    }
    :global(.guestBtn) {
        width: 5rem;
    }
</style>
