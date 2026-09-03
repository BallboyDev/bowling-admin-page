<script lang="ts">
    import { onMount } from "svelte";
    import { Button, Column, Table } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import ModifyMember from "./components/ModifyMember.svelte";
    import AddMember from "./components/AddMember.svelte";

    let members: any[] = $state([]);
    let isOpenModify: boolean = $state(false);
    let isOpenAdd: boolean = $state(false);
    let member: any = $state({});

    let id: number = $state(-1);

    const auth: Record<string, string> = {
        "0": "관리자",
        "1": "운영진",
        "2": "회원",
        "3": "게스트",
    };

    const getMemberList = () => {
        callApi(`/api/members`, "GET").then((res) => {
            members = res;
        });
    };

    onMount(() => {
        // getMemberList();
    });

    $effect(() => {
        if (!isOpenModify || !isOpenAdd) {
            getMemberList();
        }
    });
</script>

<div class="w-100 overflow-auto">
    <div class="d-flex my-3 gap-2 justify-content-end">
        <Button
            color="primary"
            outline
            onclick={() => {
                isOpenAdd = true;
            }}>회원등록</Button
        >
        <!-- <Button color="primary" outline>회원등록2</Button> -->
        <!-- <Button color="primary" outline>회원등록3</Button> -->
    </div>

    <Table
        rows={members}
        let:row
        responsive
        class=""
        style="min-width: calc(100% + 10rem)"
    >
        <!-- <Column header="회원번호">{row?.["id"]}</Column> -->
        <Column header="">{auth[row?.["auth"]]}</Column>
        <Column header="이름">
            <Button
                size="sm"
                color="primary"
                onclick={() => {
                    isOpenModify = true;
                    id = row?.["id"];
                }}>{row?.["name"]}</Button
            >
        </Column>
        <Column header="전화번호">{row?.["phone"]}</Column>
        <Column header="스타일">{row?.["style"]}</Column>
        <Column header="핸디">{row?.["handicap"]}</Column>
        <Column header="생년월일">{row?.["birth"]}</Column>
    </Table>
</div>

<ModifyMember bind:isOpen={isOpenModify} {id} />
<AddMember bind:isOpen={isOpenAdd} />
