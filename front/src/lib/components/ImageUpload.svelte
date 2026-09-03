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

<Modal {isOpen} centered>
    <ModalHeader>게임 기록 업로드</ModalHeader>
    <ModalBody>
        <div class="d-flex gap-2">
            <!-- 갤러리 또는 파일 선택 -->
            <Label for="imageUpload" class="btn btn-primary w-50 m-0">
                이미지 업로드
            </Label>

            <!-- 모바일 카메라 촬영 -->
            <Label for="cameraCapture" class="btn btn-primary w-50 m-0">
                사진 촬영
            </Label>

            <Input
                hidden
                id="imageUpload"
                name="imageUpload"
                type="file"
                accept="image/*"
                onchange={handleImageChange}
            />

            <Input
                hidden
                id="cameraCapture"
                name="cameraCapture"
                type="file"
                accept="image/*"
                capture="environment"
                onchange={handleImageChange}
            />
        </div>
    </ModalBody>
    {#if previewUrl !== "" && previewUrl !== null}
        <ModalBody>
            <Image src={previewUrl} class="w-100" />
        </ModalBody>
    {/if}

    <ModalFooter>
        <Button
            color="primary"
            disabled={!previewUrl}
            onclick={() => {
                analysis();
                isOpen = false;
            }}>분석</Button
        >
        <Button
            color="danger"
            onclick={() => {
                isOpen = false;
            }}>취소</Button
        >
    </ModalFooter>
</Modal>

<div
    class={`${progress ? "d-flex" : "d-none"} w-100 h-100 position-fixed top-0 start-0 justify-content-center align-items-center`}
    style="z-index: 5000; background-color: rgba(0, 0, 0, 0.7)"
>
    <div
        style="width: 5rem; height: 5rem; background-color: #212529;"
        class="d-flex justify-content-center align-items-center border rounded-circle"
    >
        <Spinner type="border" color="primary" />
    </div>
</div>
