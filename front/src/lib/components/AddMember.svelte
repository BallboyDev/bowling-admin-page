<script>
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

    let { isOpen = $bindable() } = $props();

    let name = $state("");
    let auth = $state(2);
    let phone = $state("");
    let style = $state("");
    let birth = $state("");

    const addMember = () => {
        const member = {
            name,
            auth,
            phone,
            style,
            birth,
        };

        callApi("/api/members/create", "POST", member).then((res) => {
            console.log(res);
            isOpen = false;
        });
    };
</script>

<Modal {isOpen} centered>
    <ModalHeader>새 회원 등록</ModalHeader>
    <ModalBody class="d-flex flex-column gap-3">
        <InputGroup>
            <InputGroupText style="width: 5rem;" class="text-center"
                >이름</InputGroupText
            >
            <Input type="text" bind:value={name} />
        </InputGroup>
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
    <ModalFooter>
        <Button
            color="secondary"
            onclick={() => {
                isOpen = false;
            }}>취소</Button
        >
        <Button
            color="primary"
            onclick={() => {
                addMember();
            }}>생성</Button
        >
    </ModalFooter>
</Modal>
