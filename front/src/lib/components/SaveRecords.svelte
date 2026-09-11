<script lang="ts">
    import {
        Button,
        Input,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "@sveltestrap/sveltestrap";
    import dayjs from "dayjs";
    import { callApi } from "../api/callApi";
    import { onMount } from "svelte";

    let { isOpen = $bindable(), scoreList, lotto = null } = $props();

    const uid = $props.id();
    let title = $state("");
    let formatDate = $state("");
    let pattern = $state("하우스 패턴");
    let mainGame = $state(true);

    onMount(() => {
        setTitle();
    });

    const setTitle = (date = dayjs()) => {
        const dt = dayjs(date);

        const firstDay = dt.startOf("month");
        const mondayOffset = (firstDay.day() + 6) % 7;
        const week = Math.ceil((dt.date() + mondayOffset) / 7) - 1;

        formatDate = dt.format("YYYY-MM-DD");
        title = `${dt.month() + 1}월 ${week}주차`;
    };

    /**
     * POST /api/events/save (기존 API), JSON 본문:
     * { records: scoreList, title: string, date: 'YYYY-MM-DD',
     *   mainGame: boolean, pattern: string, lotto: string | null }
     * records 항목: { name, game1, game2, game3, game4 }.
     * 각 game: { score: number | null, confidence: number }.
     * 200: { message: 'success', result: { recordResult, gameResult } }.
     * 500: { message }. 서버는 정기전과 회원별 기록, 개별 게임을 저장합니다.
     * 현재 서버는 회원 이름으로 회원을 찾으므로 등록된 이름이 필요합니다.
     * 기존 동작 유지: 요청 종료 시 성공/실패와 관계없이 모달을 닫습니다.
     */
    const saveScore = () => {
        callApi("/api/events/save", "POST", {
            records: scoreList,
            title,
            date: formatDate,
            mainGame,
            pattern,
            // 당첨자 이름(string | null). 미추첨이면 null.
            lotto,
        })
            .then((res) => {
                console.log(res);
            })
            .finally(() => {
                isOpen = false;
            });
    };

    $effect(() => {
        setTitle(dayjs(formatDate));
    });
</script>

<Modal {isOpen} centered scrollable labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        경기 기록 저장
        <button slot="close" type="button" class="btn-close" aria-label="저장 창 닫기" onclick={() => { isOpen = false; }}></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        <div class="bg-primary-subtle text-primary-emphasis rounded-3 p-3 mb-4">
            <h3 class="h6 fw-semibold mb-1">기록을 저장하기 전에 확인해 주세요</h3>
            <p class="small mb-0">경기 날짜와 제목을 확인한 뒤 회원별 점수를 저장합니다.</p>
        </div>
        <h3 class="h6 fw-semibold mb-3">경기 정보</h3>
        <div class="d-flex flex-column gap-3">
            <div>
                <label for={`${uid}-date`} class="form-label small fw-semibold">경기 날짜</label>
                <Input id={`${uid}-date`} type="date" bind:value={formatDate} class="py-2" />
            </div>
            <div class="border rounded-3 bg-body-tertiary p-3">
                <Input id={`${uid}-main`} type="checkbox" bind:checked={mainGame} label="정기전으로 저장" />
                <p class="small text-body-secondary mt-2 mb-0">체크를 해제하면 일반 경기로 저장합니다.</p>
            </div>
            <div>
                <label for={`${uid}-name`} class="form-label small fw-semibold">경기 제목</label>
                <Input id={`${uid}-name`} type="text" bind:value={title} class="py-2" aria-describedby={`${uid}-name-help`} />
                <p id={`${uid}-name-help`} class="small text-body-secondary mt-1 mb-0">날짜를 변경하면 제목이 자동으로 설정됩니다.</p>
            </div>
            <div>
                <label for={`${uid}-pattern`} class="form-label small fw-semibold">패턴</label>
                <Input id={`${uid}-pattern`} type="text" bind:value={pattern} class="py-2" />
            </div>
        </div>
        <h3 class="h6 fw-semibold mt-4 mb-3">저장 요약</h3>
        <dl class="row row-cols-2 g-3 bg-body-tertiary rounded-3 mx-0 mb-0 pb-3">
            <div class="col">
                <dt class="small text-body-secondary fw-normal mb-1">참여 인원</dt>
                <dd class="fw-semibold mb-0">{scoreList.length}명</dd>
            </div>
            <div class="col">
                <dt class="small text-body-secondary fw-normal mb-1">뽑기 당첨자</dt>
                <dd class="fw-semibold text-break mb-0">{lotto || "미추첨"}</dd>
            </div>
        </dl>
    </ModalBody>
    <ModalFooter class="bg-body-tertiary">
        <Button color="secondary" outline class="py-2" onclick={() => { isOpen = false; }}>취소</Button>
        <Button onclick={saveScore} color="primary" class="py-2">기록 저장</Button>
    </ModalFooter>
</Modal>
