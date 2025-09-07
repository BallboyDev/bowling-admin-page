<script>
    import {
        Button,
        ButtonGroup,
        Input,
        InputGroup,
        InputGroupText,
        Label,
    } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    // props, state value
    const { onClose } = $props();

    onMount(() => {});

    const handle = {
        setInit: () => {},
        onCancel: () => {
            onClose();
        },
        onSave: () => {
            onClose();
        },
    };
    const callApi = {};
</script>

<div
    id="filterScore"
    class="position-absolute d-flex flex-column w-100 h-100 px-3 pt-3"
>
    <div class="h1">필터</div>
    <Label class="h4">기간 설정</Label>
    <div class="box d-flex flex-column border w-100 p-2 rounded-3">
        <Label>기간 단위</Label>
        <ButtonGroup>
            <Button color="primary" outline>일</Button>
            <Button color="primary" outline>주</Button>
            <Button color="primary" outline>월</Button>
            <Button color="primary" outline>년</Button>
        </ButtonGroup>
        <hr />
        <Label>조회 기간</Label>
        <ButtonGroup class="mb-3">
            <Button color="primary" outline>1개월</Button>
            <Button color="primary" outline>3개월</Button>
            <Button color="primary" outline>6개월</Button>
            <Button color="primary" outline>1년</Button>
            <Button color="primary" outline>총기간</Button>
        </ButtonGroup>
        <InputGroup>
            <Input type="date" placeholder="date placeholder" />
            <InputGroupText>~</InputGroupText>
            <Input type="date" placeholder="date placeholder" />
        </InputGroup>
    </div>
    <hr />
    <Label class="h4">장소</Label>
    <div class="box d-flex flex-column border w-100 p-2 rounded-3">
        <Input type="checkbox" label="광교진락볼링장" />
        <Input type="checkbox" label="고릴라볼링장" />
        <Input type="checkbox" label="구리볼원볼링장" />
        <Input type="checkbox" label="춘천CC볼링장" />
        <Input type="checkbox" label="범내골볼링장" />
    </div>

    <!-- 
        기간
        장소
    -->
</div>

<div class="buttonGrp position-fixed bottom-0 end-0 px-3 pb-3 w-100 text-end">
    <hr />
    <!-- <ButtonGroup> -->
    <Button color="light" outline onclick={handle.setInit}>초기화</Button>
    <Button color="danger" outline onclick={handle.onCancel}>취소</Button>
    <Button color="primary" outline onclick={handle.onSave}>저장</Button>
    <!-- </ButtonGroup> -->
</div>

<style lang="scss">
    #filterScore {
        background-color: #161616;
        scrollbar-width: none;
        overflow: scroll;

        padding-bottom: 5.5rem;
    }
    .buttonGrp {
        background-color: #161616 !important;
    }
</style>
