<script lang="ts">
    import {
        Alert,
        Button,
        Input,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Spinner,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";
    let { isOpen = $bindable(false), id }: { isOpen?: boolean; id: number } =
        $props();
    interface MemberInfo {
        name: string;
        auth: number | string;
        phone: string | number | null;
        style: string | null;
        birth: string | null;
        handicap?: number | null;
        grade?: number | null;
    }
    const uid = $props.id();
    const roles: Record<string, string> = {
        "0": "관리자",
        "1": "운영진",
        "2": "회원",
        "3": "게스트",
    };
    let original = $state<MemberInfo | null>(null);
    let editing = $state(false);
    let confirmingRemoval = $state(false);
    let notice = $state("");
    const display = (value: string | number | null | undefined) =>
        value == null || String(value).trim() === "" ? "—" : String(value);
    const restore = () => {
        if (!original) return;
        name = original.name;
        auth = String(original.auth);
        phone = String(original.phone ?? "");
        style = original.style ?? "";
        birth = original.birth ?? "";
        handicap = original.handicap ?? "";
        grade = original.grade == null ? "" : String(original.grade);
    };
    const cancelEdit = () => {
        restore();
        editing = false;
        error = "";
    };

    let name = $state("");
    let auth = $state("2");
    let phone = $state("");
    let style = $state("");
    let birth = $state("");
    let handicap = $state<number | string | undefined>("");
    let grade = $state("");
    let busy = $state(false);
    let error = $state("");
    let loading = $state(false);
    let loaded = $state(false);
    const close = () => {
        if (!busy) isOpen = false;
    };
    $effect(() => {
        if (!isOpen) return;
        const memberId = id;
        let active = true;
        error = "";
        name = "";
        original = null;
        confirmingRemoval = false;
        editing = false;
        notice = "";
        loaded = false;
        loading = true;
        callApi(`/api/members/${memberId}`, "GET")
            .then((member) => {
                if (!active) return;
                original = { ...member };
                name = member.name;
                auth = String(member.auth);
                phone = String(member.phone ?? "");
                style = member.style ?? "";
                birth = member.birth ?? "";
                handicap = member.handicap ?? "";
                grade = member.grade == null ? "" : String(member.grade);
                loaded = true;
            })
            .catch(() => {
                if (active)
                    error =
                        "회원 정보를 불러오지 못했습니다. 닫은 후 다시 시도해 주세요.";
            })
            .finally(() => {
                if (active) loading = false;
            });
        return () => {
            active = false;
        };
    });
    const remove = async () => {
        if (busy || !loaded || editing || !confirmingRemoval) return;
        busy = true;
        error = "";
        try {
            await callApi(`/api/members/${id}`, "DELETE");
            isOpen = false;
        } catch {
            error = "탈퇴 처리에 실패했습니다. 다시 시도해 주세요.";
        } finally {
            busy = false;
        }
    };
    const save = async () => {
        if (busy || !loaded || !editing) return;
        if (!phone.trim()) {
            error = "연락처를 입력해 주세요.";
            return;
        }
        const handicapValue = handicap == null || String(handicap).trim() === "" ? null : Number(handicap);
        const gradeValue = grade === "" ? null : Number(grade);
        if ((handicapValue !== null && !Number.isSafeInteger(handicapValue)) || (gradeValue !== null && gradeValue !== 1 && gradeValue !== 2)) {
            error = "핸디캡은 정수로 입력하고 등급은 1군 또는 2군을 선택해 주세요.";
            return;
        }
        busy = true;
        error = "";
        try {
            await callApi(`/api/members/${id}`, "PUT", {
                auth: Number(auth),
                phone,
                style,
                birth,
                handicap: handicapValue,
                grade: gradeValue,
            });
            // The update API returns an execution result, not the member object.
            original = {
                ...original!,
                auth: Number(auth),
                phone,
                style,
                birth,
                handicap: handicapValue,
                grade: gradeValue,
            };
            editing = false;
            notice = "변경사항을 저장했습니다.";
        } catch {
            error =
                "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
        } finally {
            busy = false;
        }
    };
</script>

<Modal {isOpen} centered scrollable toggle={close} labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        {name
            ? `${name}님의 ${editing ? "정보 수정" : "상세 정보"}`
            : "회원 상세 정보"}
        <button
            slot="close"
            type="button"
            class="btn-close"
            aria-label="닫기"
            disabled={busy}
            onclick={close}
        ></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        {#if error}<Alert color="danger"
                ><span role="alert">{error}</span></Alert
            >{/if}
        {#if loading}
            <p class="text-center text-body-secondary py-4" role="status">
                <Spinner size="sm" class="me-2" />회원 정보를 불러오는 중입니다.
            </p>
        {:else if loaded && original}
            {#if notice}<p class="small text-success" role="status">
                    {notice}
                </p>{/if}
            <div
                class="bg-primary-subtle text-primary-emphasis rounded-3 p-3 mb-3"
            >
                <span class="small">이름</span><strong
                    class="d-block fs-5 text-break">{original.name}
                    {#if id >= 10000}<span class="badge bg-secondary-subtle text-secondary-emphasis fs-6 ms-2">GUEST</span>{/if}</strong
                >
            </div>
            {#if confirmingRemoval}
                <Alert color="danger">
                    <p class="fw-semibold mb-2" role="alert">{original.name}님을 탈퇴 처리할까요?</p>
                    <p class="mb-0 small">회원이 목록에서 삭제됩니다. 탈퇴할 회원이 맞는지 확인해 주세요.</p>
                </Alert>
            {/if}
            {#if !editing}
                <dl class="m-0">
                    {#each [["권한", roles[String(original.auth)] ?? "미지정"], ["전화번호", display(original.phone)], ["핸디캡", display(original.handicap)], ["스타일", display(original.style)], ["생일", display(original.birth)], ["등급", original.grade === 1 || original.grade === 2 ? `${original.grade}군` : display(original.grade)]] as [label, value]}
                        <div
                            class="d-flex justify-content-between gap-3 py-3 border-bottom"
                        >
                            <dt
                                class="small text-body-secondary fw-normal text-nowrap"
                            >
                                {label}
                            </dt>
                            <dd class="text-end text-break mb-0">{value}</dd>
                        </div>
                    {/each}
                </dl>
            {:else}
                <form
                    id={`${uid}-form`}
                    onsubmit={(event) => {
                        event.preventDefault();
                        save();
                    }}
                >
                    <fieldset
                        disabled={busy || !loaded}
                        class="d-flex flex-column gap-3"
                    >
                        <div>
                            <label
                                class="form-label fw-semibold small"
                                for={`${uid}-auth`}>권한</label
                            >
                            <Input
                                id={`${uid}-auth`}
                                type="select"
                                bind:value={auth}
                                class="py-2"
                            >
                                <option value="0">관리자</option>
                                <option value="1">운영진</option>
                                <option value="2">회원</option>
                                <option value="3">게스트</option>
                            </Input>
                        </div>
                        <div>
                            <label
                                class="form-label fw-semibold small"
                                for={`${uid}-phone`}
                                >연락처 <span class="text-danger">*</span
                                ></label
                            >
                            <Input
                                id={`${uid}-phone`}
                                type="tel"
                                bind:value={phone}
                                required
                                autocomplete="tel"
                                class="py-2"
                            />
                        </div>
                        <div>
                            <label
                                class="form-label fw-semibold small"
                                for={`${uid}-style`}>스타일</label
                            >
                            <Input
                                id={`${uid}-style`}
                                bind:value={style}
                                class="py-2"
                            />
                        </div>
                        <div>
                            <label
                                class="form-label fw-semibold small"
                                for={`${uid}-birth`}>생년월일</label
                            >
                            <Input
                                id={`${uid}-birth`}
                                bind:value={birth}
                                placeholder="예: 1990-01-01"
                                class="py-2"
                            />
                        </div>

                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-handicap`}>핸디캡</label>
                        <Input id={`${uid}-handicap`} type="number" step="1" bind:value={handicap} placeholder="미지정" class="py-2" />
                    </div>
                    <div>
                        <label class="form-label fw-semibold small" for={`${uid}-grade`}>등급</label>
                        <Input id={`${uid}-grade`} type="select" bind:value={grade} class="py-2">
                            <option value="">미지정</option>
                            <option value="1">1군</option>
                            <option value="2">2군</option>
                        </Input>
                    </div>
                    </fieldset>
                </form>

            {/if}
        {/if}
    </ModalBody>
    <ModalFooter class="d-flex flex-wrap gap-2 bg-body-tertiary">
        {#if editing}
            <Button
                color="secondary"
                outline
                class="py-2"
                disabled={busy}
                onclick={cancelEdit}>수정 취소</Button
            >
            <Button
                color="primary"
                type="submit"
                form={`${uid}-form`}
                class="py-2"
                disabled={busy || !loaded}
            >
                {#if busy}<Spinner size="sm" class="me-2" />처리 중…{:else}변경사항
                    저장{/if}
            </Button>
        {:else if confirmingRemoval}
            <Button color="secondary" outline class="py-2" disabled={busy} onclick={() => { confirmingRemoval = false; error = ""; }}>취소</Button>
            <Button color="danger" class="py-2" disabled={busy || !loaded} onclick={remove}>
                {#if busy}<Spinner size="sm" class="me-2" />탈퇴 처리 중…{:else}탈퇴 확정{/if}
            </Button>
        {:else}
            <Button color="danger" outline class="me-auto py-2" disabled={busy || !loaded} onclick={() => { confirmingRemoval = true; notice = ""; error = ""; }}>탈퇴</Button>
            <Button color="secondary" outline class="py-2" onclick={close}
                >닫기</Button
            >
            <Button
                color="primary"
                class="py-2"
                disabled={!loaded || loading}
                onclick={() => {
                    restore();
                    notice = "";
                    editing = true;
                }}>수정</Button
            >
        {/if}
    </ModalFooter>
</Modal>
