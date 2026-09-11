<script lang="ts">
    import { Alert, Input, Button, Card, CardBody, Spinner } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import ModifyMember from "./components/ModifyMember.svelte";
    import AddMember from "./components/AddMember.svelte";

    interface Member {
        id: number;
        auth: number | string;
        name: string;
        phone: string | number | null;
        style: string | null;
        handicap: number | null;
        birth: string | null;
    }

    const uid = $props.id();
    let members = $state<Member[]>([]);
    let isOpenModify = $state(false);
    let isOpenAdd = $state(false);
    let id = $state(-1);
    let isLoading = $state(true);
    let errorMessage = $state("");
    let retry = $state(0);

    let query = $state("");
    const filteredMembers = $derived(members.filter((member) =>
        member.name.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    ));

    // Fetch on initial display and after either dialog closes, never on opening.
    $effect(() => {
        const dialogOpen = isOpenModify || isOpenAdd;
        void retry;
        if (dialogOpen) return;

        let active = true;
        isLoading = true;
        errorMessage = "";
        callApi("/api/members", "GET")
            .then((result: Member[]) => {
                if (active) members = result;
            })
            .catch(() => {
                if (active) errorMessage = "회원 목록을 불러오지 못했습니다. 다시 시도해 주세요.";
            })
            .finally(() => {
                if (active) isLoading = false;
            });

        return () => { active = false; };
    });
</script>

<section class="w-100 py-3" aria-labelledby={`${uid}-title`}>
    <header class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
            <h2 id={`${uid}-title`} class="h4 fw-bold mb-1">회원 관리</h2>
            <p class="small text-body-secondary mb-0">회원 이름을 선택하면 정보를 수정할 수 있습니다.</p>
        </div>
        <Button color="primary" class="py-2 px-3" onclick={() => { isOpenAdd = true; }}>회원등록</Button>
    </header>

    <div class="mb-3">
        <label for={`${uid}-search`} class="form-label small fw-semibold">회원 이름 검색</label>
        <Input id={`${uid}-search`} type="search" bind:value={query} placeholder="회원 이름을 입력하세요" class="py-2" />
    </div>

    {#if isLoading}
        <div class="border rounded-3 bg-body-tertiary p-5 text-center text-body-secondary" role="status">
            <Spinner size="sm" class="me-2" />회원 목록을 불러오는 중입니다.
        </div>
    {:else if errorMessage}
        <Alert color="danger">
            <p class="mb-3" role="alert">{errorMessage}</p>
            <Button color="danger" outline class="py-2" onclick={() => { retry += 1; }}>다시 시도</Button>
        </Alert>
    {:else if members.length === 0}
        <div class="border rounded-3 bg-body-tertiary p-5 text-center" role="status">
            <p class="fw-semibold mb-2">등록된 회원이 없습니다.</p>
            <p class="small text-body-secondary mb-0">회원등록 버튼으로 첫 회원을 등록해 주세요.</p>
        </div>
    {:else}
        <p class="small text-body-secondary mb-3" role="status">전체 <strong class="text-body">{members.length}</strong>명 · 검색 결과 <strong class="text-body">{filteredMembers.length}</strong>명</p>
        {#if filteredMembers.length === 0}
            <p class="text-center text-body-secondary py-4" role="status">검색된 회원이 없습니다. 이름을 다시 확인해 주세요.</p>
        {/if}
        <ul class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3 list-unstyled mb-0">
            {#each filteredMembers as member (member.id)}
                <li class="col">
                    <Card class="h-100 rounded-3">
                        <CardBody class="p-3">
                            <div class="d-flex align-items-center justify-content-between gap-2 border-bottom pb-2 mb-3">
                                <Button
                                    color="primary"
                                    outline
                                    class="d-flex align-items-center justify-content-between gap-3 w-100 text-start text-break fw-semibold py-2 px-3"
                                    style="min-width: 0;"
                                    aria-label={`${member.name} 회원 정보 수정`}
                                    onclick={() => { id = member.id; isOpenModify = true; }}
                                ><span class="fs-5">{member.name}</span><span class="small flex-shrink-0"><i class="bi bi-pencil me-1" aria-hidden="true"></i>정보 수정</span></Button>
                            </div>
                            <!-- 가입 일자 API 필드 확정 후 실제 데이터 연결. created_at을 임의로 사용하지 않습니다. -->
                            <p class="small text-body-secondary mb-0">가입 일자 미등록</p>
                        </CardBody>
                    </Card>
                </li>
            {/each}
        </ul>
    {/if}
</section>

<ModifyMember bind:isOpen={isOpenModify} {id} />
<AddMember bind:isOpen={isOpenAdd} />
