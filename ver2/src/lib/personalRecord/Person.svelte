<script>
    import {
        Badge,
        Col,
        Column,
        Input,
        InputGroup,
        InputGroupText,
        Table,
    } from "@sveltestrap/sveltestrap";
    import { memberState } from "../state/state.svelte";
    import { onMount } from "svelte";

    let profile = $state({});
    let scores = $state([]);

    $effect(() => {
        const temp = memberState.memberList.findIndex((v) => {
            return `${v["회원번호"]}` === `${localStorage.getItem("number")}`;
        });

        const tempData = {
            회원번호: 0,
            출석: 0,
            핸디캡: 0,
            평균점수: 0,
        };

        profile = temp >= 0 ? memberState.memberList[temp] : tempData;
    });

    $effect(() => {
        scores = memberState.memberRecord;
    });

    onMount(() => {
        // profile = memberState.memberList.find((v) => {
        //     return `${v["회원번호"]}` === `${localStorage.getItem("number")}`;
        // });
    });
</script>

<div>
    <div class="d-flex">
        <h1 class="my-3">
            {`${localStorage.getItem("name")} (${localStorage.getItem("number")})`}
        </h1>
    </div>

    <!-- 출석, 평균, 핸디, 정기전 기록, 개인 정보 변경 -->
    <div class="d-flex gap-2 mb-2">
        <InputGroup>
            <InputGroupText>출석</InputGroupText>
            <Input disabled value={profile["출석"]} />
        </InputGroup>
        <InputGroup>
            <InputGroupText>핸디</InputGroupText>
            <Input disabled value={profile["핸디캡"]} />
        </InputGroup>
        <InputGroup>
            <InputGroupText>평균점수</InputGroupText>
            <Input disabled value={profile["평균점수"]} />
        </InputGroup>
    </div>

    <div>
        <Table rows={scores} let:row>
            <Column header="정기전">{row.title}</Column>
            <Column header="점수">
                <!-- {`${row.g1} / ${row.g2} / ${row.g3} / ${row.g4}`} -->
                {#if [0, "0", "-"].findIndex((v) => {
                    return v === row.g1;
                }) < 0}
                    <Badge color="primary">{row.g1}</Badge>
                {/if}
                {#if [0, "0", "-"].findIndex((v) => {
                    return v === row.g2;
                }) < 0}
                    <Badge color="primary">{row.g2}</Badge>
                {/if}
                {#if [0, "0", "-"].findIndex((v) => {
                    return v === row.g3;
                }) < 0}
                    <Badge color="primary">{row.g3}</Badge>
                {/if}
                {#if [0, "0", "-"].findIndex((v) => {
                    return v === row.g4;
                }) < 0}
                    <Badge color="primary">{row.g4}</Badge>
                {/if}
            </Column>
            <Column header="총점">{row.total || 0}</Column>
            <Column header="평균">{row.avg || 0}</Column>
        </Table>
    </div>
</div>
