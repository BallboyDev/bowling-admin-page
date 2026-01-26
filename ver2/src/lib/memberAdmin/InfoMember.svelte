<script>
    import {
        Button,
        Input,
        Modal,
        ModalBody,
        ModalFooter,
        ModalHeader,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    let { isOpen = $bindable(), selectedNumber } = $props();
</script>

<Modal bind:isOpen>
    <ModalHeader>{selectedNumber}</ModalHeader>
    <ModalBody>
        <Input class="mb-4" placeholder="이름" value="이름" />
        <Input class="mb-4" placeholder="권한" value="권한" />
        <Input class="mb-4" placeholder="핸디" value="핸디" />
        <Input class="mb-4" placeholder="평균점수" value="평균점수" />
        <Input class="mb-4" placeholder="연락처" value="연락처" />
        <Input class="mb-4" placeholder="출석" value="출석" />
    </ModalBody>
    <ModalFooter>
        <Button onclick={() => (isOpen = false)} color="secondary" disabled>
            수정
        </Button>
        <Button onclick={() => (isOpen = false)} color="primary">닫기</Button>
    </ModalFooter>
</Modal>
