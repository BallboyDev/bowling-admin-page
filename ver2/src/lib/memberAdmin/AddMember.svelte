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
    // let grade = $state()

    const addMember = async () => {
        const data = await gasApi.addMember(name, number, phone);
        console.log(data);

        // memberState.memberList = data.sheet.filter((v) => {
        //     return typeof v[0] === "number" && v[0] >= 0;
        // });

        memberState.memberList = data.sheet;
    };
</script>

<Modal bind:isOpen>
    <ModalHeader>신규 회원 등록</ModalHeader>
    <ModalBody>
        <Input class="mb-4" placeholder="이름" bind:value={name} />
        <Input class="mb-4" placeholder="회원번호" bind:value={number} />
        <Input class="mb-4" placeholder="연락처" bind:value={phone} />
        <div class="d-flex gap-3">
            <Input type="checkbox" label="회원" checked />
            <Input type="checkbox" label="운영진" />
        </div>
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
                isOpen = !isOpen;
                addMember();
            }}>등록</Button
        >
    </ModalFooter>
</Modal>
