<script>
    import {
        Button,
        Input,
        Label,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "@sveltestrap/sveltestrap";
    import gasApi from "../gas/gas";
    import { memberState } from "../state/state.svelte";

    let { isOpen = $bindable(), members = $bindable() } = $props();

    let name = $state("");
    let number = $state("");
    let phone = $state("");
    let etc = $state("");
    // let grade = $state()

    let nameCheck = $state(false);
    let numberCheck = $state(false);

    $effect(() => {
        name;
        nameCheck = false;

        number;
        numberCheck = false;
    });

    $effect(() => {
        if (!isOpen) {
            name = "";
            number = "";
            phone = "";
            etc = "";
            nameCheck = false;
            numberCheck = false;
        }
    });

    const addMember = async () => {
        if (name.trim().length === 0) {
            nameCheck = true;
            return;
        }
        if (number.trim().length === 0) {
            numberCheck = true;
            return;
        }

        isOpen = !isOpen;
        const data = await gasApi.addMember(name, number, phone, etc);

        memberState.memberList = data.sheet;
    };
</script>

<Modal bind:isOpen>
    <ModalHeader>신규 회원 등록</ModalHeader>
    <ModalBody>
        <Input
            placeholder="이름"
            bind:value={name}
            invalid={nameCheck}
            feedback="이름을 입력해주세요."
        />
        <Input
            class="mt-4"
            placeholder="회원번호"
            bind:value={number}
            invalid={numberCheck}
            feedback="회원번호를 입력해주세요."
        />
        <!-- <Input class="mt-4" placeholder="연락처" bind:value={phone} /> -->
        <Input
            class="mt-4"
            style="resize: none; height: 5rem"
            placeholder="비고"
            bind:value={etc}
            type="textarea"
        />
    </ModalBody>
    <ModalFooter>
        <Button
            color="secondary"
            onclick={() => {
                isOpen = !isOpen;
            }}>취소</Button
        >
        <Button
            color="primary"
            onclick={() => {
                addMember();
            }}>등록</Button
        >
    </ModalFooter>
</Modal>
