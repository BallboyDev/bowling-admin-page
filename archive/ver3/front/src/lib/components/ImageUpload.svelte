<script lang="ts">
    import {
        Button,
        Image,
        Input,
        Label,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
        Spinner,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";

    let {
        isOpen = $bindable(),
        selectImage = $bindable(),
        previewUrl = $bindable(),
        scoreList = $bindable(),
    } = $props();
    // let selectImage: File | null = $state(null);
    // let previewUrl = $state("");

    const uid = $props.id();
    let progress = $state(false);

    const handleImageChange = (e: Event) => {
        const input = e.currentTarget as HTMLInputElement;
        const file = input.files?.[0];

        if (file && file?.size <= 10 * 1024 * 1024) {
            selectImage = file;
            previewUrl = URL.createObjectURL(file);
        }
    };

    const analysis = () => {
        if (!!selectImage) {
            progress = true;

            const formData = new FormData();
            formData.append("image", selectImage);
            formData.append("title", "title");

            callApi("/api/openai/analysis", "POST", formData)
                .then((res) => {
                    console.log(res);

                    scoreList = res.action.players;
                })
                .finally(() => {
                    progress = false;
                });
        }
    };
</script>

<Modal {isOpen} centered scrollable labelledBy={`${uid}-title`}>
    <ModalHeader id={`${uid}-title`}>
        점수 사진 업로드
        <button slot="close" type="button" class="btn-close" aria-label="닫기" onclick={() => { isOpen = false; }}></button>
    </ModalHeader>
    <ModalBody class="p-3 p-md-4">
        <p class="small text-body-secondary mb-3">점수표 전체가 선명하게 보이는 사진을 선택해 주세요.</p>
        <div class="row row-cols-2 g-2 mb-3">
            <div class="col">
                <Label for={`${uid}-upload`} class="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100 p-3 m-0">
                    <i class="bi bi-images fs-3" aria-hidden="true"></i>
                    <span class="fw-semibold">이미지 선택</span>
                    <span class="small">갤러리 또는 파일</span>
                </Label>
            </div>
            <div class="col">
                <Label for={`${uid}-camera`} class="btn btn-outline-primary d-flex flex-column align-items-center justify-content-center gap-2 w-100 h-100 p-3 m-0">
                    <i class="bi bi-camera fs-3" aria-hidden="true"></i>
                    <span class="fw-semibold">사진 촬영</span>
                    <span class="small">카메라로 촬영</span>
                </Label>
            </div>
        </div>
        <Input id={`${uid}-upload`} class="visually-hidden" type="file" accept="image/*" aria-label="점수 이미지 선택" onchange={handleImageChange} />
        <Input id={`${uid}-camera`} class="visually-hidden" type="file" accept="image/*" capture="environment" aria-label="점수 사진 촬영" onchange={handleImageChange} />
        <p class="small text-body-secondary mb-3">이미지 파일 · 최대 10MB</p>
        {#if previewUrl}
            <div class="border rounded-3 bg-body-tertiary p-2">
                <Image src={previewUrl} alt="선택한 점수표 미리보기" class="w-100 rounded-2" style="max-height: 24rem; object-fit: contain;" />
            </div>
            <p class="small text-body-secondary text-break mt-2 mb-0">{selectImage?.name || "선택한 이미지"}</p>
        {:else}
            <div class="border rounded-3 bg-body-tertiary text-center p-4">
                <i class="bi bi-image fs-1 text-secondary" aria-hidden="true"></i>
                <p class="small text-body-secondary mt-2 mb-0">선택한 사진이 여기에 표시됩니다.</p>
            </div>
        {/if}
    </ModalBody>
    <ModalFooter class="bg-body-tertiary">
        <Button color="secondary" outline class="py-2" onclick={() => { isOpen = false; }}>취소</Button>
        <Button color="primary" class="py-2" disabled={!previewUrl} onclick={() => { analysis(); isOpen = false; }}>점수 분석</Button>
    </ModalFooter>
</Modal>

{#if progress}
    <div class="d-flex position-fixed top-0 start-0 w-100 h-100 align-items-center justify-content-center p-4" style="z-index: 5000; background: rgba(0, 0, 0, 0.7);">
        <div class="bg-body rounded-4 p-4 text-center shadow" role="status" aria-live="polite">
            <Spinner color="primary" />
            <p class="fw-semibold mt-3 mb-1">점수를 분석하고 있습니다</p>
            <p class="small text-body-secondary mb-0">분석이 끝나면 회원별 점수를 확인해 주세요.</p>
        </div>
    </div>
{/if}
