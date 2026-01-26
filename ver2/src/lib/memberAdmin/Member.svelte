<script lang="ts">
    import {
        Button,
        ButtonGroup,
        Column,
        Input,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";
    import AddMember from "./AddMember.svelte";
    import InfoMember from "./InfoMember.svelte";
    import { memberState } from "../state/state.svelte";
    import RegularGame from "./RegularGame.svelte";

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

    const handle = {
        getMembers: async () => {
            members = memberState.memberList;
        },
    };

    $effect(() => {
        handle.getMembers();
    });

    onMount(() => {});
</script>

<div>
    <h1 class="my-3">{`회원 관리`}</h1>
    <div class="m-2 d-flex justify-content-between">
        <div>
            <div class="d-flex">
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
            </div>
            <div class="d-flex">
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

        <div>
            <Button
                size="sm"
                color="primary"
                outline
                onclick={() => {
                    regularIsOpen = !regularIsOpen;
                }}>정기전 기록</Button
            >
            <Button
                size="sm"
                color="primary"
                outline
                onclick={() => {
                    addIsOpen = true;
                }}>새 인원 등록</Button
            >
        </div>
    </div>
    <Table rows={members} let:row>
        <Column header="" width="2rem">
            <!-- {row[titleList["회원번호"]] || 0} -->
            {row["회원번호"] || 0}
        </Column>
        <Column header="이름">
            <Button
                size="sm"
                color="light"
                outline
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
            <Column header="핸디캡">{row["핸디캡"] || 0}</Column>
        {/if}
        {#if showPoint}
            <Column header="포인트">{row["포인트"] || 0}</Column>
        {/if}
        {#if showAttendance}
            <Column header="출석">{row["출석"] || 0}</Column>
        {/if}
        {#if showAttendanceRate}
            <Column header="출석률">200</Column>
        {/if}
        {#if showAttendanceRank}
            <Column header="출석순위">200</Column>
        {/if}
        {#if showAverageScore}
            <Column header="평균점수">{row["평균점수"] || 0}</Column>
        {/if}
        {#if showScoreRank}
            <Column header="점수순위">200</Column>
        {/if}
        {#if showScoreDeviation}
            <Column header="점수편차">200</Column>
        {/if}
        {#each selectedRegularGame as game}
            <Column header={game.title}>
                {game[row["이름"]] || "-"}
            </Column>
        {/each}
    </Table>
</div>

<!-- 회원 추가 모달 -->
<AddMember bind:isOpen={addIsOpen} bind:members />
<!-- 회원 정보 모달 -->
<InfoMember bind:isOpen={infoIsOpen} {selectedNumber} />
<!-- 정기전 기록 호출 모달 -->
<RegularGame bind:isOpen={regularIsOpen} bind:selectedRegularGame />

<style>
    :global(.col-check) {
        width: 6rem;
    }
</style>
