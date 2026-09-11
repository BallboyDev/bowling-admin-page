<script lang="ts">
    import { Alert, Button, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "@sveltestrap/sveltestrap";
    import dayjs from "dayjs";
    let { isOpen = $bindable(false), onPreview }: {
        isOpen?: boolean; onPreview: (entry: { date: string; center: string; scores: number[] }) => void;
    } = $props();
    const uid = $props.id();
    let date = $state("");
    let center = $state("");
    let scores = $state<Array<{ id: number; value: string }>>([]);
    let nextId = 0;
    let error = $state("");
    $effect(() => {
        if (isOpen) { date = dayjs().format("YYYY-MM-DD"); center = ""; scores = [{ id: nextId++, value: "" }]; error = ""; }
    });
    const close = () => { isOpen = false; };
    /**
     * 제안 등록 API (미구현): POST /api/me/games
     * 본문: { date: 'YYYY-MM-DD', center: string, scores: number[] }
     * 서버에서 로그인 회원 식별, 개인 경기(type: personal, eventId: null)로 저장.
     * score는 0~300 정수, 최소 1게임, 0점 포함. 동일 날짜 기존 게임 뒤에 순서 부여.
     * 성공 201: { games: Game[] }, 400: 입력 오류, 401: 로그인 필요, 5xx: 저장 실패.
     * API 연결 후 성공 시 목록 재조회, 실패 시 입력 유지. 현재는 서버 요청 없이 미리보기만 반영.
     */
    const submit = () => {
        const values = scores.map((score) => Number(score.value));
        if (!date || !center.trim() || scores.some((score, index) => !score.value.trim() || !Number.isInteger(values[index]) || values[index] < 0 || values[index] > 300)) {
            error = "날짜·경기장과 각 게임의 점수(0~300 정수)를 확인해 주세요.";
            return;
        }
        onPreview({ date, center: center.trim(), scores: values });
    };
</script>
<Modal {isOpen} toggle={close} centered scrollable labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>개인 게임 기록 추가<button slot="close" type="button" class="btn-close" aria-label="닫기" onclick={close}></button></ModalHeader>
    <ModalBody>
        <Alert color="info">미리보기 입력입니다. 실제 기록으로 저장되지 않습니다.</Alert>
        <form id={`${uid}-form`} class="d-flex flex-column gap-3" onsubmit={(event) => { event.preventDefault(); submit(); }}>
            <div><label for={`${uid}-date`} class="form-label">경기 날짜</label><Input id={`${uid}-date`} type="date" bind:value={date} required /></div>
            <div><label for={`${uid}-center`} class="form-label">경기장</label><Input id={`${uid}-center`} bind:value={center} required placeholder="경기장 이름" /></div>
            <fieldset><legend class="fs-6">게임별 점수</legend>
                {#each scores as score, index (score.id)}
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <label class="small text-nowrap" for={`${uid}-score-${score.id}`}>{index + 1}게임</label>
                        <Input id={`${uid}-score-${score.id}`} type="text" inputmode="numeric" bind:value={score.value} required pattern={"[0-9]{1,3}"} placeholder="0~300" />
                        <Button color="danger" outline disabled={scores.length === 1} aria-label={`${index + 1}게임 삭제`} onclick={() => { scores = scores.filter((item) => item.id !== score.id); }}>삭제</Button>
                    </div>
                {/each}
                <Button color="primary" outline class="w-100" onclick={() => { scores = [...scores, { id: nextId++, value: "" }]; }}>게임 추가</Button>
            </fieldset>
            {#if error}<p class="text-danger small mb-0" role="alert">{error}</p>{/if}
        </form>
    </ModalBody>
    <ModalFooter><Button color="secondary" outline onclick={close}>취소</Button><Button color="primary" type="submit" form={`${uid}-form`}>미리보기에 추가</Button></ModalFooter>
</Modal>
