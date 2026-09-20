<script lang="ts">
    import { Alert, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";

    interface EventInfo {
        eventId: string; title: string; date: string; eventType: number | boolean;
        pattern: string | null; center?: string | null; player: number | null; image?: string; lotto?: string | null;
    }
    let { isOpen = $bindable(false), eventInfo }: { isOpen?: boolean; eventInfo: EventInfo } = $props();
    const uid = $props.id();
    let title = $state("");
    let date = $state("");
    let pattern = $state("");
    let eventType = $state("1");
    let center = $state("");
    let saving = $state(false);
    let error = $state("");
    $effect(() => {
        if (!isOpen) return;
        error = "";
        center = eventInfo.center ?? "";
        title = eventInfo.title;
        date = eventInfo.date;
        pattern = eventInfo.pattern ?? "";
        eventType = Number(eventInfo.eventType) === 1 ? "1" : "0";
    });
    const close = () => { if (!saving) isOpen = false; };

    /**
     * GET /api/events/{eventId}: { eventInfo, records } (부모에서 조회).
     * POST /api/events/modify: { eventId, title, date, eventType, pattern, center }.
     * eventId는 식별자로 유지. title 필수, date는 YYYY-MM-DD 유효 날짜,
     * eventType은 숫자 1(정기전)/0(이벤트), pattern/center는 문자열(빈 문자열 허용).
     * 200: 수정된 EventInfo 객체 직접 반환. 400/404/500: { message }.
     * 현재 서버는 events.date를 수정하지만 games.date는 변경하지 않음.
     * center는 events와 연결 games에 함께 반영. player/lotto는 변경하지 않음.
     */
    const save = async () => {
        if (saving) return;
        error = "";
        const parsedDate = new Date(`${date}T00:00:00.000Z`);
        if (!title.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== date) {
            error = "제목과 유효한 경기 날짜를 입력해 주세요.";
            return;
        }
        saving = true;
        try {
            await callApi("/api/events/modify", "POST", {
                eventId: eventInfo.eventId, title: title.trim(), date,
                eventType: Number(eventType), pattern: pattern.trim(), center: center.trim(),
            });
            // 부모의 모달 닫힘 감지가 현재 선택한 정기전의 목록/상세를 재조회합니다.
            isOpen = false;
        } catch {
            error = "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
        } finally { saving = false; }
    };

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
        <button slot="close" type="button" class="btn-close" aria-label="정기전 관리 닫기" disabled={saving} onclick={close}></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        <div class="bg-primary-subtle text-primary-emphasis rounded-3 p-3 mb-4">
            <h3 class="h6 fw-bold text-break mb-1">{eventInfo.title || "정기전"}</h3>
            <p class="small mb-0">{eventInfo.date || "날짜 미등록"}</p>
        </div>
        <h3 class="h6 fw-semibold mb-3">기본 정보</h3>
        <form id={`${uid}-form`} onsubmit={(event) => { event.preventDefault(); save(); }}>
        <fieldset disabled={saving} class="d-flex flex-column gap-3">
            <div><label for={`${uid}-name`} class="form-label small fw-semibold">정기전 제목</label><Input id={`${uid}-name`} bind:value={title} class="py-2" /></div>
            <div class="row g-3">
                <div class="col-12 col-sm-6"><label for={`${uid}-date`} class="form-label small fw-semibold">경기 날짜</label><Input id={`${uid}-date`} type="date" bind:value={date} class="py-2" /></div>
                <div class="col-12 col-sm-6"><label for={`${uid}-type`} class="form-label small fw-semibold">경기 구분</label><Input id={`${uid}-type`} type="select" bind:value={eventType} class="py-2"><option value="1">정기전</option><option value="0">이벤트</option></Input></div>
            </div>
            <div><label for={`${uid}-pattern`} class="form-label small fw-semibold">패턴</label><Input id={`${uid}-pattern`} bind:value={pattern} class="py-2" placeholder="패턴 이름" /></div>
            <div><label for={`${uid}-center`} class="form-label small fw-semibold">볼링장</label><Input id={`${uid}-center`} bind:value={center} class="py-2" placeholder="볼링장 이름" /></div>
        </fieldset>
        </form>
        {#if error}<Alert color="danger" class="mt-3"><span role="alert">{error}</span></Alert>{/if}
        <dl class="row row-cols-2 g-3 bg-body-tertiary rounded-3 mx-0 my-3 pb-3">
            <div class="col"><dt class="small text-body-secondary fw-normal mb-1">참여 인원</dt><dd class="fw-semibold mb-0">{eventInfo.player ?? "—"}명</dd></div>
            <div class="col"><dt class="small text-body-secondary fw-normal mb-1">뽑기 당첨자</dt><dd class="fw-semibold text-break mb-0">{eventInfo.lotto || "미등록"}</dd></div>
        </dl>

        <div class="border border-danger-subtle rounded-3 p-3 mt-4">
            <h3 class="h6 text-danger fw-semibold">정기전 삭제</h3>
            <p class="small text-body-secondary mb-3">이 정기전과 연결된 회원 점수 및 게임 기록을 삭제합니다.</p>
            <Button color="danger" outline class="py-2" disabled={saving} onclick={deleteEvent}>게임 삭제</Button>
        </div>
    </ModalBody>
    <ModalFooter class="bg-body-tertiary">
        <Button color="secondary" outline class="py-2" disabled={saving} onclick={close}>취소</Button>
        <Button color="primary" class="py-2" type="submit" form={`${uid}-form`} disabled={saving}>{#if saving}<Spinner size="sm" class="me-2" />저장 중…{:else}변경사항 저장{/if}</Button>
    </ModalFooter>
</Modal>
