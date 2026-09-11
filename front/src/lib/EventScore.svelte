<script lang="ts">
    import { untrack } from "svelte";
    import { Alert, Button, Card, CardBody, Spinner } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import ModifyEvent from "./components/ModifyEvent.svelte";

    interface EventItem { eventId: string; title: string; pos: number; }
    interface EventInfo {
        eventId: string; title: string; date: string; eventType: number;
        pattern: string | null; player: number | null; image: string;
        lotto?: string | null;
    }
    interface ScoreRecord {
        memberId: number; name: string | null;
        game1: number | null; game2: number | null;
        game3: number | null; game4: number | null;
        average: number | null; totalScore: number | null; gameCount: number | null;
    }
    let { selected = true }: { selected?: boolean } = $props();
    const uid = $props.id();
    const gameKeys = ["game1", "game2", "game3", "game4"] as const;
    let eventList = $state<EventItem[]>([]);
    let eventInfo = $state<EventInfo | null>(null);
    let scoreList = $state<ScoreRecord[]>([]);
    let selectedId = $state("");
    let listLoading = $state(true);
    let detailLoading = $state(false);
    let listError = $state("");
    let detailError = $state("");
    let listRetry = $state(0);
    let detailRetry = $state(0);
    let modifyEventIsOpen = $state(false);
    const selectedIndex = $derived(eventList.findIndex((event) => event.eventId === selectedId));
    const currentEvent = $derived(eventList[selectedIndex]);
    const validScore = (score: number | null): score is number => typeof score === "number" && Number.isFinite(score);
    const format = (value: number | null, digits = 0) => validScore(value)
        ? value.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits }) : "—";
    const summary = $derived.by(() => {
        let sum = 0;
        let count = 0;
        let bestScore: { value: number; name: string } | null = null;
        let bestAverage: { value: number; name: string } | null = null;
        for (const row of scoreList) {
            const name = row.name || "이름 없음";
            for (const key of gameKeys) {
                const score = row[key];
                if (!validScore(score)) continue;
                sum += score;
                count++;
                if (!bestScore || score > bestScore.value) bestScore = { value: score, name };
            }
            if (validScore(row.average) && gameKeys.some((key) => validScore(row[key])) &&
                (!bestAverage || row.average > bestAverage.value)) {
                bestAverage = { value: row.average, name };
            }
        }
        return { average: count ? sum / count : null, bestScore, bestAverage };
    });

    $effect(() => {
        if (!selected || modifyEventIsOpen) return;
        void listRetry;
        let active = true;
        listLoading = true;
        listError = "";
        callApi("/api/events/eventList", "GET")
            .then((result: EventItem[]) => {
                if (!active) return;
                const previousId = untrack(() => selectedId);
                eventList = [...result].sort((a, b) => a.pos - b.pos);
                selectedId = eventList.some((event) => event.eventId === previousId)
                    ? previousId : (eventList.at(-1)?.eventId ?? "");
                detailRetry++;
            })
            .catch(() => { if (active) listError = "정기전 목록을 불러오지 못했습니다."; })
            .finally(() => { if (active) listLoading = false; });
        return () => { active = false; };
    });

    $effect(() => {
        if (!selected || modifyEventIsOpen || listLoading || listError) return;
        const eventId = selectedId;
        void detailRetry;
        eventInfo = null;
        scoreList = [];
        detailError = "";
        if (!eventId) { detailLoading = false; return; }
        let active = true;
        detailLoading = true;
        callApi(`/api/events/${eventId}`, "GET")
            .then((result: { eventInfo: EventInfo; records: ScoreRecord[] }) => {
                if (!active) return;
                if (!result.eventInfo) throw new Error("Missing event");
                eventInfo = result.eventInfo;
                scoreList = result.records;
            })
            .catch(() => { if (active) detailError = "정기전 기록을 불러오지 못했습니다."; })
            .finally(() => { if (active) detailLoading = false; });
        return () => { active = false; };
    });

    const move = (offset: number) => {
        const next = eventList[selectedIndex + offset];
        if (next) selectedId = next.eventId;
    };
</script>

<section class="w-100 py-3" aria-labelledby={`${uid}-title`} style="font-variant-numeric: tabular-nums;">
    <h2 id={`${uid}-title`} class="h4 fw-bold mb-1">정기전 기록</h2>
    <p class="small text-body-secondary mb-3">정기전별 결과와 회원들의 게임 점수를 확인하세요.</p>

    {#if listLoading}
        <p class="text-center text-body-secondary py-5" role="status"><Spinner size="sm" class="me-2" />정기전 목록을 불러오는 중입니다.</p>
    {:else if listError}
        <Alert color="danger"><p role="alert">{listError}</p><Button color="danger" outline onclick={() => listRetry++}>다시 시도</Button></Alert>
    {:else if eventList.length === 0}
        <p class="bg-body-tertiary border rounded-3 text-center text-body-secondary p-4" role="status">등록된 정기전이 없습니다.</p>
    {:else}
        <nav class="d-flex align-items-center justify-content-between gap-2 border rounded-3 p-3 mb-3" aria-label="정기전 이동">
            <Button color="primary" outline class="py-2" disabled={selectedIndex <= 0} aria-label="이전 정기전" onclick={() => move(-1)}><i class="bi bi-chevron-left" aria-hidden="true"></i></Button>
            <div class="text-center text-break" style="min-width: 0;" aria-live="polite">
                <h3 class="h5 fw-semibold mb-1">{currentEvent?.title || "정기전"}</h3>
                <span class="small text-body-secondary">{selectedIndex + 1} / {eventList.length}</span>
            </div>
            <Button color="primary" outline class="py-2" disabled={selectedIndex >= eventList.length - 1} aria-label="다음 정기전" onclick={() => move(1)}><i class="bi bi-chevron-right" aria-hidden="true"></i></Button>
        </nav>

        {#if detailLoading}
            <p class="text-center text-body-secondary py-5" role="status"><Spinner size="sm" class="me-2" />점수를 불러오는 중입니다.</p>
        {:else if detailError}
            <Alert color="danger"><p role="alert">{detailError}</p><Button color="danger" outline onclick={() => detailRetry++}>다시 시도</Button></Alert>
        {:else if eventInfo}
            <Card class="bg-body-tertiary rounded-3 mb-4">
                <CardBody class="p-3 p-md-4">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                        <div><h3 class="h6 fw-bold mb-1">정기전 요약</h3><span class="small text-body-secondary">{eventInfo.date || "날짜 미등록"}</span></div>
                        <Button color="primary" outline class="py-2" onclick={() => modifyEventIsOpen = true}>정기전 관리</Button>
                    </div>
                    <dl class="row row-cols-2 row-cols-lg-3 g-3 mb-0">
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">전체 평균</dt><dd class="fs-4 fw-semibold text-primary mb-0">{format(summary.average, 2)}</dd></div>
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">참여 인원</dt><dd class="fs-4 fw-semibold mb-0">{format(eventInfo.player)}<small class="fs-6 fw-normal">명</small></dd></div>
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">패턴</dt><dd class="text-break mb-0">{eventInfo.pattern || "—"}</dd></div>
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">최고 점수</dt><dd class="fw-semibold mb-0">{format(summary.bestScore?.value ?? null)}<span class="d-block small text-body-secondary fw-normal text-break">{summary.bestScore?.name ?? "—"}</span></dd></div>
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">최고 평균</dt><dd class="fw-semibold mb-0">{format(summary.bestAverage?.value ?? null, 2)}<span class="d-block small text-body-secondary fw-normal text-break">{summary.bestAverage?.name ?? "—"}</span></dd></div>
                        <div class="col"><dt class="small fw-normal text-body-secondary mb-1">뽑기</dt><dd class="text-break mb-0">{eventInfo.lotto || "—"}</dd></div>
                    </dl>
                </CardBody>
            </Card>

            <h3 class="h6 fw-bold mb-2">회원별 점수</h3>
            <p class="small text-body-secondary mb-3">200점 이상은 빨간색으로 강조합니다. 미입력 점수는 —로 표시합니다.</p>
            {#if scoreList.length === 0}
                <p class="border rounded-3 text-center text-body-secondary p-4" role="status">등록된 참가 기록이 없습니다.</p>
            {:else}
                <ul class="row row-cols-1 row-cols-lg-2 g-3 list-unstyled mb-0">
                    {#each scoreList as row}
                        <li class="col">
                            <Card class="h-100 rounded-3">
                                <CardBody class="p-3">
                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-2">
                                        <h4 class="h6 fw-bold text-break mb-0">{row.name || "이름 없음"}</h4>
                                        <span class="text-nowrap small text-body-secondary">평균 <strong class="fs-5 text-primary">{format(row.average, 2)}</strong></span>
                                    </div>
                                    <p class="small text-body-secondary mb-3">총점 {format(row.totalScore)} · {format(row.gameCount)}게임</p>
                                    <dl class="row row-cols-4 g-2 mb-0">
                                        {#each gameKeys as key, index}
                                            {@const high = validScore(row[key]) && row[key] >= 200}
                                            <div class="col">
                                                <div class="border rounded-3 text-center py-2" class:bg-danger-subtle={high} class:text-danger-emphasis={high} class:bg-body-tertiary={!high} class:text-primary={!high}>
                                                    <dt class="small fw-normal mb-1">{index + 1}게임</dt>
                                                    <dd class="fs-5 fw-semibold mb-0">{format(row[key])}</dd>
                                                </div>
                                            </div>
                                        {/each}
                                    </dl>
                                </CardBody>
                            </Card>
                        </li>
                    {/each}
                </ul>
            {/if}
        {/if}
    {/if}
</section>

{#if eventInfo}<ModifyEvent bind:isOpen={modifyEventIsOpen} {eventInfo} />{/if}
