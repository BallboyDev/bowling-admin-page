<script lang="ts">
    import {
        Spinner,
        Button,
        Input,
        Modal,
        ModalBody,
        ModalHeader,
        ModalFooter,
    } from "@sveltestrap/sveltestrap";
    import dayjs from "dayjs";
    import { callApi } from "../api/callApi";
    let {
        isOpen = $bindable(false),
        memberId,
        onSaved,
    }: {
        isOpen?: boolean;
        memberId?: number;
        onSaved: (date: string) => void;
    } = $props();
    const uid = $props.id();
    let date = $state("");
    let center = $state("");
    let scores = $state<Array<{ id: number; value: string }>>([]);
    let nextId = 0;
    let error = $state("");
    let saving = $state(false);
    $effect(() => {
        if (isOpen) {
            date = dayjs().format("YYYY-MM-DD");
            center = "";
            scores = [{ id: nextId++, value: "" }];
            error = "";
        }
    });
    const close = () => {
        if (!saving) isOpen = false;
    };
    const submit = async () => {
        if (saving) return;
        if (!Number.isSafeInteger(memberId) || !memberId || memberId <= 0) {
            error = "회원 정보를 확인할 수 없습니다. 다시 시도해 주세요.";
            return;
        }
        const values = scores.map((score) => Number(score.value));
        if (
            scores.length === 0 ||
            !date ||
            !center.trim() ||
            scores.some(
                (score, index) =>
                    !score.value.trim() ||
                    !Number.isInteger(values[index]) ||
                    values[index] < 0 ||
                    values[index] > 300,
            )
        ) {
            error = "날짜·경기장과 각 게임의 점수(0~300 정수)를 확인해 주세요.";
            return;
        }

        saving = true;
        error = "";
        try {
            await callApi("/api/games/save", "POST", {
                date, memberId, center: center.trim(),
                scores: values.map((score, index) => ({ gameNumber: index + 1, score })),
            });
        } catch {
            error = "기록을 저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.";
            return;
        } finally {
            saving = false;
        }
        isOpen = false;
        onSaved(date);
    };
</script>

<Modal {isOpen} toggle={close} centered scrollable labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}
        >개인 게임 기록 추가<button
            slot="close"
            type="button"
            class="btn-close"
            disabled={saving}
            aria-label="닫기"
            onclick={close}
        ></button></ModalHeader
    >
    <ModalBody>
        <form
            id={`${uid}-form`}
            class="d-flex flex-column gap-3"
            onsubmit={(event) => {
                event.preventDefault();
                submit();
            }}
        >
            <fieldset disabled={saving} class="d-flex flex-column gap-3">
            <div>
                <label for={`${uid}-date`} class="form-label">경기 날짜</label
                ><Input
                    id={`${uid}-date`}
                    type="date"
                    bind:value={date}
                    required
                />
            </div>
            <div>
                <label for={`${uid}-center`} class="form-label">경기장</label
                ><Input
                    id={`${uid}-center`}
                    bind:value={center}
                    required
                    placeholder="경기장 이름"
                />
            </div>
            <fieldset>
                <legend class="fs-6">게임별 점수</legend>
                {#each scores as score, index (score.id)}
                    <div class="d-flex align-items-center gap-2 mb-2">
                        <label
                            class="small text-nowrap"
                            for={`${uid}-score-${score.id}`}
                            >{index + 1}게임</label
                        >
                        <Input
                            id={`${uid}-score-${score.id}`}
                            type="text"
                            inputmode="numeric"
                            bind:value={score.value}
                            required
                            pattern={"[0-9]{1,3}"}
                            placeholder="0~300"
                        />
                        <Button
                            color="danger"
                            outline
                            disabled={scores.length === 1}
                            aria-label={`${index + 1}게임 삭제`}
                            onclick={() => {
                                scores = scores.filter(
                                    (item) => item.id !== score.id,
                                );
                            }}>삭제</Button
                        >
                    </div>
                {/each}
                <Button
                    color="primary"
                    outline
                    class="w-100"
                    onclick={() => {
                        scores = [...scores, { id: nextId++, value: "" }];
                    }}>게임 추가</Button
                >
            </fieldset>
            </fieldset>
            {#if error}<p class="text-danger small mb-0" role="alert">
                    {error}
                </p>{/if}
        </form>
    </ModalBody>
    <ModalFooter
        ><Button color="secondary" outline disabled={saving} onclick={close}>취소</Button><Button
            color="primary"
            type="submit"
            disabled={saving}
            form={`${uid}-form`}>{#if saving}<Spinner size="sm" class="me-2" />저장 중…{:else}기록 저장{/if}</Button
        ></ModalFooter
    >
</Modal>
