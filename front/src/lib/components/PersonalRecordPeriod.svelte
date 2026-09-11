<script lang="ts">
    import { Button, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "@sveltestrap/sveltestrap";
    let { isOpen = $bindable(false), startDate, endDate, onApply }: {
        isOpen?: boolean; startDate: string; endDate: string; onApply: (start: string, end: string) => void;
    } = $props();
    const uid = $props.id();
    let start = $state("");
    let end = $state("");
    let error = $state("");
    $effect(() => { if (isOpen) { start = startDate; end = endDate; error = ""; } });
    const close = () => { isOpen = false; };
    const apply = () => {
        if (!start || !end || start > end) { error = "시작일과 종료일을 확인해 주세요."; return; }
        onApply(start, end);
    };
</script>
<Modal {isOpen} toggle={close} centered labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>조회 기간 변경<button slot="close" class="btn-close" type="button" aria-label="닫기" onclick={close}></button></ModalHeader>
    <ModalBody>
        <form id={`${uid}-form`} class="d-flex flex-column gap-3" onsubmit={(event) => { event.preventDefault(); apply(); }}>
            <div><label for={`${uid}-start`} class="form-label">시작일</label><Input id={`${uid}-start`} type="date" bind:value={start} required /></div>
            <div><label for={`${uid}-end`} class="form-label">종료일</label><Input id={`${uid}-end`} type="date" bind:value={end} required /></div>
            <Button color="secondary" outline onclick={() => { start = "2026-01-01"; end = "2026-12-31"; }}>2026년 전체</Button>
            {#if error}<p class="small text-danger mb-0" role="alert">{error}</p>{/if}
        </form>
    </ModalBody>
    <ModalFooter><Button color="secondary" outline onclick={close}>취소</Button><Button color="primary" type="submit" form={`${uid}-form`}>적용</Button></ModalFooter>
</Modal>
