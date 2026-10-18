<script lang="ts">
    import { Button, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "@sveltestrap/sveltestrap";
    let { isOpen = $bindable(false), startDate, endDate, recordScope = "all", onApply }: {
        isOpen?: boolean; startDate: string; endDate: string; recordScope?: "all" | "regular"; onApply: (start: string, end: string, scope: "all" | "regular") => void;
    } = $props();
    const uid = $props.id();
    const currentYear = new Date().getFullYear();
    let start = $state("");
    let end = $state("");
    let scope = $state<"all" | "regular">("all");
    let error = $state("");
    $effect(() => { if (isOpen) { start = startDate; end = endDate; scope = recordScope; error = ""; } });
    const close = () => { isOpen = false; };
    const apply = () => {
        if (!start || !end || start > end) { error = "시작일과 종료일을 확인해 주세요."; return; }
        onApply(start, end, scope);
    };
</script>
<Modal {isOpen} toggle={close} centered labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>조회 조건 변경<button slot="close" class="btn-close" type="button" aria-label="닫기" onclick={close}></button></ModalHeader>
    <ModalBody>
        <form id={`${uid}-form`} class="d-flex flex-column gap-3" onsubmit={(event) => { event.preventDefault(); apply(); }}>
            <div><label for={`${uid}-start`} class="form-label">시작일</label><Input id={`${uid}-start`} type="date" bind:value={start} required /></div>
            <div><label for={`${uid}-end`} class="form-label">종료일</label><Input id={`${uid}-end`} type="date" bind:value={end} required /></div>
            <Button color="secondary" outline onclick={() => { start = `${currentYear}-01-01`; end = `${currentYear}-12-31`; }}>{currentYear}년 전체</Button>
            <div>
                <label for={`${uid}-scope`} class="form-label">조회 범위</label>
                <Input id={`${uid}-scope`} type="select" bind:value={scope}>
                    <option value="all">모두 조회 (정기전·개인)</option>
                    <option value="regular">정기전만 조회</option>
                </Input>
            </div>
            {#if error}<p class="small text-danger mb-0" role="alert">{error}</p>{/if}
        </form>
    </ModalBody>
    <ModalFooter><Button color="secondary" outline onclick={close}>취소</Button><Button color="primary" type="submit" form={`${uid}-form`}>적용</Button></ModalFooter>
</Modal>
