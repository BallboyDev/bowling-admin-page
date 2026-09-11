<script lang="ts">
    import { Alert, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Spinner } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";
    let { isOpen = $bindable(false) }: { isOpen?: boolean } = $props();
    const uid = $props.id();
    let name = $state("");
    let auth = $state("2");
    let phone = $state("");
    let style = $state("");
    let birth = $state("");
    let busy = $state(false);
    let error = $state("");
    let loading = $state(false);
    let loaded = $state(false);
    const close = () => { if (!busy) isOpen = false; };
    $effect(() => {
        if (isOpen) {
            name = "";
            auth = "2";
            phone = "";
            style = "";
            birth = "";
            error = "";
        }
    });
    const save = async () => {
        if (busy) return;
        if (!name.trim() || !phone.trim()) {
            error = "이름과 연락처를 입력해 주세요.";
            return;
        }
        busy = true;
        error = "";
        try {
            await callApi("/api/members/create", "POST", { name, auth: Number(auth), phone, style, birth });
            isOpen = false;
        } catch {
            error = "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
        } finally { busy = false; }
    };
</script>

<Modal {isOpen} centered scrollable toggle={close} labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        새 회원 등록
        <button slot="close" type="button" class="btn-close" aria-label="닫기" disabled={busy} onclick={close}></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        {#if error}<Alert color="danger"><span role="alert">{error}</span></Alert>{/if}
        {#if loading}
            <p class="text-center text-body-secondary py-4" role="status"><Spinner size="sm" class="me-2" />회원 정보를 불러오는 중입니다.</p>
        {:else}
            <form id={`${uid}-form`} onsubmit={(event) => { event.preventDefault(); save(); }}>
                <fieldset disabled={busy} class="d-flex flex-column gap-3">
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-name`}>이름 <span class="text-danger">*</span></label>
                        <Input id={`${uid}-name`} bind:value={name} required autocomplete="name" class="py-2" />
                    </div>
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-auth`}>권한</label>
                        <Input id={`${uid}-auth`} type="select" bind:value={auth} class="py-2">
                            <option value="0">관리자</option>
                            <option value="1">운영진</option>
                            <option value="2">회원</option>
                            <option value="3">게스트</option>
                        </Input>
                    </div>
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-phone`}>연락처 <span class="text-danger">*</span></label>
                        <Input id={`${uid}-phone`} type="tel" bind:value={phone} required autocomplete="tel" class="py-2" />
                    </div>
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-style`}>스타일</label>
                        <Input id={`${uid}-style`} bind:value={style} class="py-2" />
                    </div>
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-birth`}>생년월일</label>
                        <Input id={`${uid}-birth`} bind:value={birth} placeholder="예: 1990-01-01" class="py-2" />
                    </div>
                </fieldset>
            </form>
        {/if}
    </ModalBody>
    <ModalFooter class="d-flex flex-wrap gap-2 bg-body-tertiary">
        <Button color="secondary" outline class="py-2" disabled={busy} onclick={close}>취소</Button>
        <Button color="primary" type="submit" form={`${uid}-form`} class="py-2" disabled={busy || loading}>
            {#if busy}<Spinner size="sm" class="me-2" />처리 중…{:else}회원 등록{/if}
        </Button>
    </ModalFooter>
</Modal>
