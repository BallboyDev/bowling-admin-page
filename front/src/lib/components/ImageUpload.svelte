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
        // if (!!selectImage) {
        //     progress = true;

        //     const formData = new FormData();
        //     formData.append("image", selectImage);
        //     formData.append("title", "title");

        //     callApi("/api/openai/analysis", "POST", formData)
        //         .then((res) => {
        //             console.log(res);
        //         })
        //         .finally(() => {
        //             progress = false;
        //         });
        // }

        const res = {
            action: {
                players: [
                    {
                        name: "이정섭",
                        game1: "226",
                        game2: "259",
                        game3: "195",
                        game4: "192",
                        avg: "218",
                    },
                    {
                        name: "형지영",
                        game1: "X",
                        game2: "110/125",
                        game3: "128/143",
                        game4: "89/104",
                        avg: "116.5",
                    },
                    {
                        name: "박남석",
                        game1: "188",
                        game2: "203",
                        game3: "179",
                        game4: "180",
                        avg: "187.5",
                    },
                    {
                        name: "이무석",
                        game1: "199",
                        game2: "*245",
                        game3: "173",
                        game4: "172",
                        avg: "197.25",
                    },
                    {
                        name: "전주원",
                        game1: "*177",
                        game2: "154",
                        game3: "143",
                        game4: "153",
                        avg: "156.75",
                    },
                    {
                        name: "한미화",
                        game1: "X",
                        game2: "X",
                        game3: "220/235",
                        game4: "164/179",
                        avg: "199.5",
                    },
                    {
                        name: "심대승",
                        game1: "X",
                        game2: "X",
                        game3: "177",
                        game4: "*270",
                        avg: "223.5",
                    },
                    {
                        name: "유제민",
                        game1: "X",
                        game2: "195",
                        game3: "*132",
                        game4: "180",
                        avg: "169",
                    },
                    {
                        name: "김미옥",
                        game1: "X",
                        game2: "183/198",
                        game3: "156/171",
                        game4: "179/194",
                        avg: "180.17",
                    },
                    {
                        name: "유기환",
                        game1: "183",
                        game2: "206",
                        game3: "148",
                        game4: "187",
                        avg: "181",
                    },
                    {
                        name: "양승우",
                        game1: "159",
                        game2: "205",
                        game3: "198",
                        game4: "176",
                        avg: "184.5",
                    },
                    {
                        name: "정귀진",
                        game1: "201",
                        game2: "*205",
                        game3: "192",
                        game4: "160",
                        avg: "189.5",
                    },
                ],
            },
        };

        scoreList = res.action.players.map((v) => {
            return { ...v, average: 0 };
        });
    };

    $inspect(previewUrl);
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
