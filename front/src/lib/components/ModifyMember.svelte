<script lang="ts">
    import { onMount } from "svelte";
    import {
        Button,
        Input,
        InputGroup,
        InputGroupText,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "../api/callApi";

    let { isOpen = $bindable(), id } = $props();

    let name = $state("");
    let auth = $state(-1);
    let phone = $state("");
    let style = $state("");
    let birth = $state("");

    $effect(() => {
        if (isOpen) {
            memberInfo();
        }
    });

    const memberInfo = () => {
        console.log("memberInfo");
        callApi(`/api/members/${id}`, "GET").then((res) => {
            console.log(res);
            name = res.name;
            auth = res.auth;
            phone = res.phone;
            style = res.style;
            birth = res.birth;
        });
    };

    const deleteMember = () => {
        callApi(`/api/members/${id}`, "DELETE").then((res) => {
            console.log(res);
            isOpen = false;
        });
    };

    const modifyInfo = () => {
        console.log(name, auth, phone, style, birth);
        const member = {
            name,
            auth,
            phone,
            style,
            birth,
        };
        callApi(`/api/members/${id}`, "PUT", member).then((res) => {
            console.log(res);
            isOpen = false;
        });
    };
</script>

<Modal {isOpen} centered={true}>
    <ModalHeader>{name}</ModalHeader>
    <ModalBody class="d-flex flex-column gap-3">
        <InputGroup>
            <Input
                class="me-3"
                type="checkbox"
                label="관리자"
                checked={auth === 0}
                onchange={() => {
                    auth = 0;
                }}
            />
            <Input
                class="me-3"
                type="checkbox"
                label="운영진"
                checked={auth === 1}
                onchange={() => {
                    auth = 1;
                }}
            />
            <Input
                class="me-3"
                type="checkbox"
                label="회원"
                checked={auth === 2}
                onchange={() => {
                    auth = 2;
                }}
            />
            <Input
                class="me-3"
                type="checkbox"
                label="게스트"
                checked={auth === 3}
                onchange={() => {
                    auth = 3;
                }}
            />
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;" class="text-center"
                >연락처</InputGroupText
            >
            <Input type="text" bind:value={phone} />
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;" class="text-center"
                >스타일</InputGroupText
            >
            <Input type="text" bind:value={style} />
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;" class="text-center"
                >생년월일</InputGroupText
            >
            <Input type="text" bind:value={birth} />
        </InputGroup>
    </ModalBody>
    <ModalFooter class="d-flex justify-content-between">
        <Button color="danger" onclick={deleteMember}>탈퇴</Button>
        <div>
            <Button
                color="secondary"
                onclick={() => {
                    isOpen = !isOpen;
                }}>취소</Button
            >
            <Button color="primary" onclick={modifyInfo}>수정</Button>
        </div>
    </ModalFooter>
</Modal>
