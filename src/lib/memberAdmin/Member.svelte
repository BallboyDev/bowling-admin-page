<script lang="ts">
    import {
        Accordion,
        AccordionItem,
        Button,
        ButtonGroup,
        Column,
        Input,
        InputGroup,
        InputGroupText,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import AddMember from "./AddMember.svelte";
    import InfoMember from "./InfoMember.svelte";
    import { gameState, memberState } from "../state/state.svelte";
    import RegularGame from "./RegularGame.svelte";
    import PageTitle from "../common/PageTitle.svelte";
    import Unsort from "../icons/Unsort.svelte";

    // 회원 리스트 정보
    let members = $state([]);

    // 회원 추가 모달
    let addIsOpen: boolean = $state(false);
    // 회원 정보 모달
    let infoIsOpen: boolean = $state(false);
    // 정기전 선택 모달
    let regularIsOpen: boolean = $state(false);

    // 선택된 회원
    let selectedNumber: number = $state(0);
    // 선택된 정기전 리스트
    let selectedRegularGame: { title: string; count: 0; [key: string]: any }[] =
        $state([]);

    /** 데이터 컬럼 */
    // 핸디캡
    let showHandicap: boolean = $state(true);
    // 포인트
    let showPoint: boolean = $state(true);
    // 출석
    let showAttendance: boolean = $state(true);
    // 출석률
    let showAttendanceRate: boolean = $state(false);
    // 출석순위
    let showAttendanceRank: boolean = $state(false);
    // 평균점수
    let showAverageScore: boolean = $state(true);
    // 점수순위
    let showScoreRank: boolean = $state(false);
    // 점수편차
    let showScoreDeviation: boolean = $state(false);

    let sortKey = $state({
        key: "",
        asc: true,
    });

    $effect(() => {
        // 출석 순위, 점수 순위
        setRank();
    });

    const setRank = () => {
        const cRnad = {
            a: {},
            s: {},
        };
        const aRank = {
            a: -1,
            r: -1,
        };
        const sRank = {
            a: -1,
            r: -1,
        };

        const rank = {
            attendance: [...memberState.memberList]
                .sort((a, b) => (b["출석"] || 0) - (a["출석"] || 0))
                .map((v, i) => {
                    cRnad.a[v["출석"]] = (cRnad.a[v["출석"]] || 0) + 1;
                    if (aRank.a !== v["출석"]) {
                        aRank.a = v["출석"];
                        aRank.r = i + 1;
                    }
                    return {
                        num: v["회원번호"],
                        index: i + 1,
                        출석등수: aRank.r,
                    };
                }),
            score: [...memberState.memberList]
                .sort((a, b) => (b["평균점수"] || 0) - (a["평균점수"] || 0))
                .map((v, i) => {
                    cRnad.s[v["평균점수"]] = (cRnad.s[v["평균점수"]] || 0) + 1;
                    if (sRank.a !== v["평균점수"]) {
                        sRank.a = v["평균점수"];
                        sRank.r = i + 1;
                    }
                    return {
                        num: v["회원번호"],
                        index: i + 1,
                        점수등수: sRank.r,
                    };
                }),
        };

        members = memberState.memberList.map((v, i) => {
            return {
                index: i + 1,
                ...v,
                attendanceRank: rank.attendance.find(
                    (r) => r.num === v["회원번호"],
                )?.출석등수,
                ScoreRank: rank.score.find((r) => r.num === v["회원번호"])
                    ?.점수등수,
            };
        });
    };

    const sortList = (key) => {
        const sortSet = sortKey;
        if (sortSet.key === key && sortSet.asc === false) {
            sortSet.key = "";
            sortSet.asc = true;

            setRank();
            return;
        } else if (sortSet.key === key) {
            sortSet.asc = !sortSet.asc;
        } else {
            sortSet.key = key;
            sortSet.asc = true;
        }

        members = [...members]
            .sort((a, b) => {
                let res = 0;
                if (key === "point") {
                    res = a["포인트"] - b["포인트"];
                } else if (key === "attendance") {
                    res = a["출석"] - b["출석"];
                } else if (key === "avgScore") {
                    res = a["평균점수"] - b["평균점수"];
                } else if (key === "scoreDeviation") {
                    res = a["점수편차"] - b["점수편차"];
                }
                return sortSet.asc ? -res : res;
            })
            .map((v, i) => {
                return { ...v, index: i + 1 };
            });

        sortKey = sortSet;
    };

    onMount(() => {});
</script>

<div class="page-member">
    <!-- <h1 class="my-3">{`회원 관리`}</h1> -->
    <PageTitle pageTitle="회원 관리">
        <Button
            class="flex-shrink-0"
            size="sm"
            color="primary"
            outline
            onclick={() => {
                regularIsOpen = !regularIsOpen;
            }}>정기전 기록</Button
        >
        <Button
            class="flex-shrink-0"
            size="sm"
            color="primary"
            outline
            onclick={() => {
                addIsOpen = true;
            }}>새 인원 등록</Button
        >
    </PageTitle>

    <Accordion>
        <AccordionItem header="GBC 2026년 통합 기록">
            <div class="d-flex flex-wrap gap-2 justify-content-between">
                <!-- <div class="d-flex justify-content-between my-2 gap-2"> -->
                <InputGroup class="meta-data">
                    <InputGroupText>회원수</InputGroupText>
                    <Input />
                </InputGroup>
                <InputGroup class="meta-data">
                    <InputGroupText>GBC 평균</InputGroupText>
                    <Input />
                </InputGroup>
                <!-- </div> -->
                <!-- <div class="d-flex justify-content-between my-2 gap-2"> -->
                <InputGroup class="meta-data">
                    <InputGroupText>정기전 수</InputGroupText>
                    <Input />
                </InputGroup>
                <InputGroup class="meta-data">
                    <InputGroupText>출석 합계</InputGroupText>
                    <Input />
                </InputGroup>
                <!-- </div> -->
                <!-- <div class="d-flex justify-content-between my-2 gap-2"> -->
                <InputGroup class="meta-data">
                    <InputGroupText>포인트 합계</InputGroupText>
                    <Input />
                </InputGroup>
                <InputGroup class="meta-data">
                    <InputGroupText>지급 / 잔여</InputGroupText>
                    <Input />
                </InputGroup>
                <!-- </div> -->
            </div>
        </AccordionItem>
    </Accordion>

    <hr />

    <div class="button-wrap my-2 d-flex justify-content-between w-100">
        <div class="d-flex flex-wrap justify-content-between">
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="핸디캡"
                bind:checked={showHandicap}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="포인트"
                bind:checked={showPoint}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="출석"
                bind:checked={showAttendance}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="출석률"
                bind:checked={showAttendanceRate}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="출석순위"
                bind:checked={showAttendanceRank}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="평균점수"
                bind:checked={showAverageScore}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="점수순위"
                bind:checked={showScoreRank}
            />
            <Input
                class="col-check mx-2"
                type="checkbox"
                label="점수편차"
                bind:checked={showScoreDeviation}
            />
        </div>
    </div>

    <div class="table-wrap">
        <Table>
            <thead>
                <tr>
                    <th>순서</th>
                    <th>이름</th>
                    <th>권한</th>
                    {#if showHandicap}
                        <th> 핸디 </th>
                    {/if}
                    {#if showPoint}
                        <th
                            onclick={(e) => {
                                sortList("point");
                            }}
                        >
                            <div
                                class="d-flex align-items-center justify-content-center"
                            >
                                <div>포인트</div>
                                <Unsort
                                    asc={sortKey.key === "point" && sortKey.asc}
                                    desc={sortKey.key === "point" &&
                                        !sortKey.asc}
                                />
                            </div></th
                        >
                    {/if}
                    {#if showAttendance}
                        <th
                            onclick={(e) => {
                                sortList("attendance");
                            }}
                            ><div
                                class="d-flex align-items-center justify-content-center"
                            >
                                <div>출석</div>
                                <Unsort
                                    asc={sortKey.key === "attendance" &&
                                        sortKey.asc}
                                    desc={sortKey.key === "attendance" &&
                                        !sortKey.asc}
                                />
                            </div></th
                        >
                    {/if}
                    {#if showAttendanceRate}
                        <th>출석률</th>
                    {/if}
                    {#if showAttendanceRank}
                        <th>출석순위</th>
                    {/if}
                    {#if showAverageScore}
                        <th
                            onclick={(e) => {
                                sortList("avgScore");
                            }}
                            ><div
                                class="d-flex align-items-center justify-content-center"
                            >
                                <div>평균점수</div>
                                <Unsort
                                    asc={sortKey.key === "avgScore" &&
                                        sortKey.asc}
                                    desc={sortKey.key === "avgScore" &&
                                        !sortKey.asc}
                                />
                            </div></th
                        >
                    {/if}
                    {#if showScoreRank}
                        <th>점수순위</th>
                    {/if}
                    {#if showScoreDeviation}
                        <th
                            onclick={(e) => {
                                sortList("scoreDeviation");
                            }}
                            ><div
                                class="d-flex align-items-center justify-content-center"
                            >
                                <div>점수편차</div>
                                <Unsort
                                    asc={sortKey.key === "scoreDeviation" &&
                                        sortKey.asc}
                                    desc={sortKey.key === "scoreDeviation" &&
                                        !sortKey.asc}
                                />
                            </div></th
                        >
                    {/if}
                    {#each selectedRegularGame as game}
                        <th>{game.title}</th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each members as row}
                    <tr>
                        <td class="text-center">{row["index"]}</td>
                        <td
                            ><Button
                                size="sm"
                                color="primary"
                                onclick={() => {
                                    selectedNumber = row["회원번호"] || 0;
                                    infoIsOpen = true;
                                }}>{row["이름"] || 0}</Button
                            ></td
                        >
                        <td>{row["권한"]}</td>
                        {#if showHandicap}
                            <td class="text-center">{row["핸디캡"] || 0}</td>
                        {/if}
                        {#if showPoint}
                            <td class="text-center">{row["포인트"] || 0}</td>
                        {/if}
                        {#if showAttendance}
                            <td class="text-center">{row["출석"] || 0}</td>
                        {/if}
                        {#if showAttendanceRate}
                            <td
                                >{`${(row["출석"] / (gameState.gameList.length || 0)) * 100}%`}</td
                            >
                        {/if}
                        {#if showAttendanceRank}
                            <td>{row["attendanceRank"] || 0}</td>
                        {/if}
                        {#if showAverageScore}
                            <td
                                >{Math.round(row["평균점수"] * 100 || 0) /
                                    100}</td
                            >
                        {/if}
                        {#if showScoreRank}
                            <td>{row["ScoreRank"] || 0}</td>
                        {/if}
                        {#if showScoreDeviation}
                            <td>점수편차</td>
                        {/if}
                        {#each selectedRegularGame as game}
                            <td
                                >{Math.round(game[row["이름"]] * 100 || 0) /
                                    100 || "-"}</td
                            >
                        {/each}
                    </tr>
                {/each}
            </tbody>
            <!-- <Table rows={members} let:row> -->
            <!-- <Column header="회원번호⇵↓↑" width="2rem">
                {row["회원번호"] || 0}
            </Column> -->
            <!-- <Column header="순서" width="2rem">
                {row["index"] || 0}
            </Column>
            <Column header="이름">
                <Button
                    size="sm"
                    color="primary"
                    onclick={() => {
                        selectedNumber = row["회원번호"] || 0;
                        infoIsOpen = true;
                    }}>{row["이름"] || 0}</Button
                >
            </Column>
            <Column header="권한">
                {row["권한"] || 0}
            </Column>
            {#if showHandicap}
                <Column header="핸디캡" align="center"
                    >{row["핸디캡"] || 0}</Column
                >
            {/if}
            {#if showPoint}
                <Column
                    header="포인트 ▼"
                    align="center"
                    onclick={(e) => {
                        sortList(e, "point");
                    }}>{row["포인트"] || 0}</Column
                >
            {/if}
            {#if showAttendance}
                <Column
                    header="출석"
                    align="center"
                    onclick={(e) => {
                        sortList(e, "attendance");
                    }}>{row["출석"] || 0}</Column
                >
            {/if}
            {#if showAttendanceRate}
                <Column header="출석률"
                    >{`${(row["출석"] / (gameState.gameList.length || 0)) * 100}%`}</Column
                >
            {/if}
            {#if showAttendanceRank}
                <Column header="출석순위">{row["attendanceRank"] || 0}</Column>
            {/if}
            {#if showAverageScore}
                <Column
                    header="평균점수"
                    onclick={(e) => {
                        sortList(e, "avgScore");
                    }}>{Math.round(row["평균점수"] * 100 || 0) / 100}</Column
                >
            {/if}
            {#if showScoreRank}
                <Column header="점수순위">{row["ScoreRank"] || 0}</Column>
            {/if}
            {#if showScoreDeviation}
                <Column
                    header="점수편차"
                    onclick={(e) => {
                        sortList(e, "scoreDeviation");
                    }}>200</Column
                >
            {/if}
            {#each selectedRegularGame as game}
                <Column header={game.title}>
                    {Math.round(game[row["이름"]] * 100 || 0) / 100 || "-"}
                </Column>
            {/each} -->
        </Table>
    </div>
</div>

<!-- 회원 추가 모달 -->
<AddMember bind:isOpen={addIsOpen} bind:members />
<!-- 회원 정보 모달 -->
<InfoMember bind:isOpen={infoIsOpen} {selectedNumber} />
<!-- 정기전 기록 호출 모달 -->
<RegularGame bind:isOpen={regularIsOpen} bind:selectedRegularGame />

<style lang="scss">
    .page-member {
        width: 100%;

        & > .table-wrap {
            flex-wrap: nowrap;
            overflow-x: auto;
        }
    }
    :global(.meta-data) {
        width: 32%;
    }

    @media (max-width: 768px) {
        .button-wrap {
            flex-direction: column;
        }
        :global(.meta-data) {
            width: 48.5%;
        }
    }
</style>
