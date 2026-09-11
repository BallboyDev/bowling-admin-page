<script lang="ts">
    import { Alert, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";

    interface EventInfo {
        eventId: string; title: string; date: string; eventType: number | boolean;
        pattern: string | null; player: number | null; image?: string; lotto?: string | null;
    }
    let { isOpen = $bindable(false), eventInfo }: { isOpen?: boolean; eventInfo: EventInfo } = $props();
    const uid = $props.id();
    let title = $state("");
    let date = $state("");
    let pattern = $state("");
    let eventType = $state("1");
    $effect(() => {
        if (!isOpen) return;
        title = eventInfo.title;
        date = eventInfo.date;
        pattern = eventInfo.pattern ?? "";
        eventType = Number(eventInfo.eventType) === 1 ? "1" : "0";
    });
    const close = () => { isOpen = false; };

    /**
     * 현재 조회 API: GET /api/events/{eventId} (부모 화면에서 호출)
     * 200: { eventInfo: { eventId, title, date, eventType, pattern, player, image, lotto }, records: [...] }
     * 현재 서버는 없는 ID에 명시적 404를 반환하지 않음. 서버 오류: 500 { message }.
     *
     * 제안 수정 API (미구현): PATCH /api/events/{eventId}
     * 본문: { title: string, date: 'YYYY-MM-DD', eventType: 0 | 1, pattern: string }
     * title은 공백 제외 필수, date는 유효한 날짜. player/lotto는 이 화면에서 수정하지 않음.
     * 200: { eventInfo: EventInfo }, 400: { message, errors? }, 404: { message }, 500: { message }.
     * 서버는 수정 권한을 확인하고, 권한 없음은 403을 반환하도록 제안.
     * eventId는 날짜 변경 후에도 유지. events.date와 관련 games.date를 하나의 트랜잭션으로 갱신.
     * 날짜 변경은 연결된 records의 eventId를 변경하지 않음.
     * API 연결 시 아래 초안으로 callApi를 호출하고 성공 후 부모 기록을 재조회.
     * 실패 시 입력값 유지 및 오류 표시. 현재는 실제 요청 없이 디자인 초안만 제공.
     * callApi(`/api/events/${eventInfo.eventId}`, 'PATCH', {
     *     title: title.trim(), date, eventType: Number(eventType), pattern: pattern.trim()
     * });
     */

    /**
     * 현재 삭제 API: DELETE /api/events/{eventId}, 요청 본문 없음.
     * 200: { result: { eventResult, recordResult, gameResult } } (각 SQLite 실행 결과)
     * 정기전과 연결된 records/games를 삭제. 500: { message }.
     * 현재 서버는 없는 ID에 대한 명시적 404나 삭제 트랜잭션을 제공하지 않음.
     * 기존 동작 유지: 성공/실패 모두 모달 닫기. 오류 UX 개선은 후속 작업.
     */
    const deleteEvent = () => {
        callApi(`/api/events/${eventInfo.eventId}`, "DELETE")
            .then((res) => { console.log(res); })
            .finally(close);
    };
</script>

<Modal {isOpen} centered scrollable labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        정기전 관리
        <button slot="close" type="button" class="btn-close" aria-label="정기전 관리 닫기" onclick={close}></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        <div class="bg-primary-subtle text-primary-emphasis rounded-3 p-3 mb-4">
            <h3 class="h6 fw-bold text-break mb-1">{eventInfo.title || "정기전"}</h3>
            <p class="small mb-0">{eventInfo.date || "날짜 미등록"}</p>
        </div>
        <h3 class="h6 fw-semibold mb-3">기본 정보</h3>
        <div class="d-flex flex-column gap-3">
            <div><label for={`${uid}-name`} class="form-label small fw-semibold">정기전 제목</label><Input id={`${uid}-name`} bind:value={title} class="py-2" /></div>
            <div class="row g-3">
                <div class="col-12 col-sm-6"><label for={`${uid}-date`} class="form-label small fw-semibold">경기 날짜</label><Input id={`${uid}-date`} type="date" bind:value={date} class="py-2" /></div>
                <div class="col-12 col-sm-6"><label for={`${uid}-type`} class="form-label small fw-semibold">경기 구분</label><Input id={`${uid}-type`} type="select" bind:value={eventType} class="py-2"><option value="1">정기전</option><option value="0">일반 경기</option></Input></div>
            </div>
            <div><label for={`${uid}-pattern`} class="form-label small fw-semibold">패턴</label><Input id={`${uid}-pattern`} bind:value={pattern} class="py-2" placeholder="패턴 이름" /></div>
        </div>
        <dl class="row row-cols-2 g-3 bg-body-tertiary rounded-3 mx-0 my-3 pb-3">
            <div class="col"><dt class="small text-body-secondary fw-normal mb-1">참여 인원</dt><dd class="fw-semibold mb-0">{eventInfo.player ?? "—"}명</dd></div>
            <div class="col"><dt class="small text-body-secondary fw-normal mb-1">뽑기 당첨자</dt><dd class="fw-semibold text-break mb-0">{eventInfo.lotto || "미등록"}</dd></div>
        </dl>
        <Alert color="info" class="small">정보 수정은 API 연결 예정입니다. 입력값은 저장되지 않으며 창을 다시 열면 원래 정보로 돌아갑니다.</Alert>
        <div class="border border-danger-subtle rounded-3 p-3 mt-4">
            <h3 class="h6 text-danger fw-semibold">정기전 삭제</h3>
            <p class="small text-body-secondary mb-3">이 정기전과 연결된 회원 점수 및 게임 기록을 삭제합니다.</p>
            <Button color="danger" outline class="py-2" onclick={deleteEvent}>게임 삭제</Button>
        </div>
    </ModalBody>
    <ModalFooter class="bg-body-tertiary">
        <Button color="secondary" outline class="py-2" onclick={close}>취소</Button>
        <Button color="primary" class="py-2" disabled>변경사항 저장 · 연결 예정</Button>
    </ModalFooter>
</Modal>
