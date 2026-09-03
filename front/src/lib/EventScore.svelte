<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Badge,
        Button,
        ButtonGroup,
        Column,
        Icon,
        Input,
        InputGroup,
        InputGroupText,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import { onMount } from "svelte";
    import ModifyEvent from "./components/ModifyEvent.svelte";

    let { selected } = $props();

    let eventInfo = $state({
        eventId: "",
        title: "",
        date: "",
        eventType: 1,
        pattern: "",
        player: 0,
        image: "",
        maxScore: "",
        maxAvg: "",
        totalAvg: 0,
        lotto: "",
    });
    let eventList: any[] = $state([]);

    let selectEvent = $state({ title: "", eventId: "", pos: 0 });
    let selectPos = $state(0);
    let scoreList = $state([
        {
            name: "",
            game1: 0,
            game2: 0,
            game3: 0,
            game4: 0,
            average: 0,
            totalScore: 0,
            gameCount: 0,
        },
    ]);

    let modifyEventIsOpen = $state(false);

    let maxScore = $derived.by(() => {
        const temp = scoreList.reduce<{
            name: string;
            score: number;
        } | null>((result, item) => {
            const score = Math.max(
                ...(["game1", "game2", "game3", "game4"] as const)
                    .map((game) => item[game])
                    .filter((value): value is number => value !== null),
            );

            if (result === null || score > result.score) {
                return { name: item.name, score };
            }

            return result;
        }, null);

        return temp;
    });
    let maxAvg = $derived.by(() => {
        const temp = scoreList.reduce((highest, item) =>
            item.average > highest.average ? item : highest,
        );

        return temp;
    });
    let totalAvg = $derived.by(() => {
        const gameKeys = ["game1", "game2", "game3", "game4"] as const;

        const { sum, count } = scoreList.reduce(
            (result, item) => {
                gameKeys.forEach((key) => {
                    const score = item[key];

                    if (score !== null) {
                        result.sum += score;
                        result.count += 1;
                    }
                });

                return result;
            },
            { sum: 0, count: 0 },
        );

        return count === 0 ? 0 : sum / count;
    });

    const getEventList = () => {
        callApi("/api/events/eventList", "GET").then((res) => {
            eventList = res;
            selectEvent = {
                ...eventList[eventList.length - 1],
                pos: eventList.length - 1,
            };
            selectPos = eventList.length;
        });
    };

    const getEvent = () => {
        callApi(`/api/events/${selectEvent.eventId}`, "GET").then((res) => {
            eventInfo = res.eventInfo;
            scoreList = res.records;
        });
    };

    $effect(() => {
        if (!!selected && !modifyEventIsOpen) {
            getEventList();
        }
    });

    $effect(() => {
        if (selectEvent.eventId !== "") {
            getEvent();
        }
    });

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
        <ButtonGroup class="d-flex ">
            <Button
                size="sm"
                color="primary"
                disabled={selectPos === 0}
                onclick={() => {
                    selectPos--;
                    selectEvent = eventList.find((v) => {
                        return v.pos === selectPos;
                    });
                }}><Icon name="caret-left" /></Button
            >
            <Button color="light" outline disabled style="width: 10rem;"
                >{selectEvent?.title || ""}</Button
            >
            <Button
                size="sm"
                color="primary"
                disabled={selectPos === eventList.length}
                onclick={() => {
                    selectPos++;
                    selectEvent = eventList.find((v) => {
                        return v.pos === selectPos;
                    });
                }}><Icon name="caret-right" /></Button
            >
        </ButtonGroup>
    </div>

    <Accordion>
        <AccordionItem
            header={`${eventInfo?.title} (${eventInfo.date}) 상세기록`}
        >
            <div class="d-flex gap-2 flex-column mb-2">
                <InputGroup>
                    <InputGroupText style="width: 4rem;">패턴</InputGroupText>
                    <Input
                        disabled
                        style="width: 5rem;"
                        value={eventInfo.pattern}
                    />
                    <InputGroupText style="width: 5.5rem;"
                        >전체 평균</InputGroupText
                    >
                    <Input disabled value={totalAvg} />
                </InputGroup>
                <InputGroup>
                    <InputGroupText style="width: 5.5rem;"
                        >최고 점수</InputGroupText
                    >
                    <Input
                        disabled
                        value={`${maxScore?.score} (${maxScore?.name})`}
                    />
                </InputGroup>
                <InputGroup>
                    <InputGroupText style="width: 5.5rem;"
                        >최고 평균</InputGroupText
                    >
                    <Input
                        disabled
                        value={`${maxAvg.average} (${maxAvg.name})`}
                    />
                </InputGroup>

                <InputGroup>
                    <InputGroupText style="width: 5.5rem;"
                        >참여 인원</InputGroupText
                    >
                    <Input disabled value={eventInfo?.player} />
                    <InputGroupText style="width: 5.5rem;">뽑기</InputGroupText>
                    <Input disabled value="홍길동" />
                </InputGroup>
            </div>
            <div class="d-flex justify-content-end">
                <Button
                    size="sm"
                    color="danger"
                    onclick={() => {
                        modifyEventIsOpen = true;
                    }}>수정</Button
                >
            </div>
        </AccordionItem>
    </Accordion>

    {#each scoreList as row}
        <div class="d-flex flex-column border-bottom py-2">
            <div class="mb-2">
                <span>{row.name}</span>
                <span class="ms-3">평균: {row.average}</span>
                <span class="ms-3">총점: {row.totalScore}</span>
                <span class="ms-3">게임수: {row.gameCount}</span>
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

<ModifyEvent bind:isOpen={modifyEventIsOpen} {eventInfo} />
