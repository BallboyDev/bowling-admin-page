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
    import { onMount } from "svelte";
    import { memberState } from "../state/state.svelte";
    import gasApi from "../gas/gas";

    let { isOpen = $bindable(), selectedNumber } = $props();

    let selectedMember = $state({});

    // 이름
    let name = $state("");
    // 권한
    let auth = $state("");
    // 핸디캡
    let handicap = $state(0);
    // 연락처
    let phone = $state("");
    // 포인트
    let point = $state(0);
    // 비고
    let etc = $state("");

    let status = $derived.by(() => {
        return (
            name !== selectedMember["이름"] ||
            auth !== selectedMember["권한"] ||
            handicap !== selectedMember["핸디캡"] ||
            phone !== selectedMember["연락처"] ||
            point !== selectedMember["포인트"]
        );
    });

    $effect(() => {
        const info = memberState.memberList.find((member) => {
            return `${member["회원번호"]}` === `${selectedNumber}`;
        });
        if (info) {
            name = info["이름"];
            auth = info["권한"];
            handicap = info["핸디캡"];
            phone = info["연락처"];
            point = info["포인트"];

            selectedMember = info;
        }
    });
</script>

<Modal bind:isOpen>
    <ModalHeader>{`${name} (${selectedNumber})`}</ModalHeader>
    <ModalBody>
        <!-- <InputGroup class="mb-4">
            <InputGroupText>이름</InputGroupText>
            <Input placeholder="이름" bind:value={name} />
        </InputGroup> -->

        <InputGroup class="mb-4">
            <InputGroupText>권한</InputGroupText>
            <Input placeholder="권한" bind:value={auth} />
        </InputGroup>

        <InputGroup class="mb-4">
            <InputGroupText>핸디캡</InputGroupText>
            <Input placeholder="핸디캡" bind:value={handicap} type="number" />
        </InputGroup>

        <!-- <InputGroup class="mb-4">
            <InputGroupText>연락처</InputGroupText>
            <Input placeholder="연락처" bind:value={phone} type="tel" />
        </InputGroup> -->

        <InputGroup class="mb-4">
            <InputGroupText>포인트</InputGroupText>
            <Input placeholder="포인트" bind:value={point} type="number" />
        </InputGroup>

        <InputGroup class="mb-4">
            <InputGroupText>비고</InputGroupText>
            <Input
                placeholder="비고"
                style="resize: none; height: 5rem"
                bind:value={etc}
                type="textarea"
            />
        </InputGroup>
    </ModalBody>
    <ModalFooter>
        <Button
            onclick={() => {
                // call update member api
                gasApi.updateMember(
                    selectedNumber,
                    name,
                    auth,
                    handicap,
                    phone,
                    point,
                );

                isOpen = false;
            }}
            color="primary"
            disabled={!status}
        >
            수정
        </Button>
        <Button
            onclick={() => {
                isOpen = false;
            }}
            color="primary">닫기</Button
        >
    </ModalFooter>
</Modal>
