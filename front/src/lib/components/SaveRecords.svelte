<script lang="ts">
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
    import dayjs from "dayjs";
    import { callApi } from "../api/callApi";
    import { onMount } from "svelte";

    let { isOpen = $bindable(), scoreList } = $props();

    let title = $state("");
    let formatDate = $state("");
    let pattern = $state("하우스 패턴");
    let mainGame = $state(true);

    onMount(() => {
        setTitle();
    });

    const setTitle = (date = dayjs()) => {
        const dt = dayjs(date);

        const firstDay = dt.startOf("month");
        const mondayOffset = (firstDay.day() + 6) % 7;
        const week = Math.ceil((dt.date() + mondayOffset) / 7) - 1;

        formatDate = dt.format("YYYY-MM-DD");
        title = `${dt.month() + 1}월 ${week}주차`;
    };

    const saveScore = () => {
        callApi("/api/events/save", "POST", {
            records: scoreList,
            title,
            date: formatDate,
            mainGame,
            pattern,
        })
            .then((res) => {
                console.log(res);
            })
            .finally(() => {
                isOpen = false;
            });
    };

    $effect(() => {
        setTitle(dayjs(formatDate));
    });
</script>

<Modal {isOpen} centered>
    <ModalBody class="d-flex gap-2 flex-column">
        <InputGroup>
            <InputGroupText style="width: 5rem;">날짜</InputGroupText>
            <Input type="date" bind:value={formatDate} />
            <InputGroupText>정기전</InputGroupText>
            <InputGroupText>
                <Input type="checkbox" bind:checked={mainGame} />
            </InputGroupText>
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;">타이틀</InputGroupText>
            <Input type="text" bind:value={title} />
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;">패턴</InputGroupText>
            <Input type="text" bind:value={pattern} />
        </InputGroup>
        <InputGroup>
            <InputGroupText style="width: 5rem;">인원 수</InputGroupText>
            <Input type="number" value={scoreList.length} disabled />
        </InputGroup>
    </ModalBody>
    <ModalFooter>
        <Button onclick={saveScore} color="primary">저장</Button>
        <Button
            onclick={() => {
                isOpen = false;
            }}>취소</Button
        >
    </ModalFooter>
</Modal>
