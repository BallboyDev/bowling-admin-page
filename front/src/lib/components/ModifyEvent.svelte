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
    import { callApi } from "../api/callApi";

    let { isOpen = $bindable(), eventInfo } = $props();

    let event = $state({
        eventId: "",
        title: "",
        date: "",
        eventType: 1,
        pattern: "",
        player: 0,
        image: "",
        maxScore: "",
        maxAvg: "",
        totalAvg: 0,
        lotto: "",
    });

    $effect(() => {
        if (isOpen) {
            event = eventInfo;
        }
    });

    const deleteEvent = () => {
        callApi(`/api/events/${event.eventId}`, "DELETE")
            .then((res) => {
                console.log(res);
            })
            .finally(() => {
                isOpen = false;
            });
    };

    $inspect(event);
</script>

<Modal {isOpen} centered={true}>
    <ModalHeader>
        <Input
            type="text"
            bsSize="lg"
            value={`${event?.title} (${event.date})`}
        />
    </ModalHeader>
    <ModalBody></ModalBody>
    <ModalFooter class="d-flex justify-content-between">
        <Button color="danger" onclick={deleteEvent}>게임 삭제</Button>
        <div>
            <Button
                color="secondary"
                onclick={() => {
                    isOpen = false;
                }}>취소</Button
            >
            <Button color="primary" onclick={() => {}}>수정</Button>
        </div>
    </ModalFooter>
</Modal>
