<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        Card,
        CardBody,
    } from "@sveltestrap/sveltestrap";
    import PersonalRecordPeriod from "./components/PersonalRecordPeriod.svelte";
    import AddPersonalRecord from "./components/AddPersonalRecord.svelte";

    interface Game {
        id: number;
        date: string;
        center: string | null;
        score: number | null;
        sequence: number;
        type: "regular" | "personal";
        eventId: string | null;
    }
    let { selected = true }: { selected?: boolean } = $props();
    const uid = $props.id();
    let periodOpen = $state(false);
    let addOpen = $state(false);
    let startDate = $state("2026-01-01");
    let endDate = $state("2026-12-31");
    // 미리보기 데이터. 실제 회원 ID나 실제 기록으로 사용하지 않습니다.
    let previewGames = $state<Game[]>([
        { id: 1, date: "2026-08-15", center: "예시 볼링장 A", score: 165, sequence: 1, type: "regular", eventId: "preview-1" },
        { id: 2, date: "2026-08-15", center: "예시 볼링장 A", score: 182, sequence: 2, type: "regular", eventId: "preview-1" },
        { id: 3, date: "2026-08-22", center: "예시 볼링장 B", score: 201, sequence: 1, type: "personal", eventId: null },
        { id: 4, date: "2026-08-22", center: "예시 볼링장 B", score: 174, sequence: 2, type: "personal", eventId: null },
        { id: 5, date: "2026-09-05", center: "예시 볼링장 A", score: 190, sequence: 1, type: "regular", eventId: "preview-2" },
        { id: 6, date: "2026-09-05", center: "예시 볼링장 A", score: 215, sequence: 2, type: "regular", eventId: "preview-2" },
        { id: 7, date: "2026-09-05", center: "예시 볼링장 B", score: 178, sequence: 3, type: "personal", eventId: null },
    ]);
    const games = $derived(previewGames.filter((game) => game.date >= startDate && game.date <= endDate));
    const status = "ready";
    let notice = $state("");
    /**
     * 제안 조회 API (미구현): GET /api/me/games?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
     * 서버는 로그인 회원을 식별하고 접근 권한을 확인합니다. 임의 회원 ID를 사용하지 않습니다.
     * 날짜 양 끝 포함, 한국 현지 경기일 기준. 응답: { games: Game[] }, 기록 없음은 [].
     * score는 0~300 정수 또는 null(미입력). center는 문자열 또는 null.
     * sequence는 동일 날짜의 게임 순서. type은 regular/personal, 개인 경기는 eventId: null.
     * 400: 잘못된 기간, 401: 로그인 필요, 5xx: 서버 오류.
     * API 연결 시 previewGames를 실제 응답으로 교체하고 예시 데이터/안내를 제거합니다.
     */
    const applyPeriod = (start: string, end: string) => {
        startDate = start;
        endDate = end;
        notice = "";
        periodOpen = false;
    };
    const addPreview = (entry: { date: string; center: string; scores: number[] }) => {
        let id = Math.max(0, ...previewGames.map((game) => game.id));
        const offset = Math.max(0, ...previewGames.filter((game) => game.date === entry.date).map((game) => game.sequence));
        previewGames = [...previewGames, ...entry.scores.map((score, index): Game => ({
            id: ++id, date: entry.date, center: entry.center, score, sequence: offset + index + 1,
            type: "personal", eventId: null,
        }))];
        addOpen = false;
        notice = entry.date < startDate || entry.date > endDate
            ? "미리보기에 추가했습니다. 조회 기간 밖의 기록이므로 기간을 변경하면 확인할 수 있습니다. 서버에는 저장되지 않았습니다."
            : "미리보기에 추가했습니다. 서버에는 저장되지 않았으며 새로고침하면 초기화됩니다.";
    };
    const validScore = (score: number | null): score is number =>
        typeof score === "number" && Number.isFinite(score);
    const stats = (items: Game[]) => {
        const scores = items.map((game) => game.score).filter(validScore);
        return {
            count: scores.length,
            average: scores.length
                ? scores.reduce((sum, score) => sum + score, 0) / scores.length
                : null,
            highest: scores.length ? Math.max(...scores) : null,
        };
    };
    const format = (value: number | null, digits = 0) =>
        value == null
            ? "—"
            : value.toLocaleString("ko-KR", {
                  minimumFractionDigits: digits,
                  maximumFractionDigits: digits,
              });
    const summary = $derived(stats(games));
    const days = $derived.by(() => {
        const grouped = new Map<string, Game[]>();
        for (const game of games)
            grouped.set(game.date, [...(grouped.get(game.date) ?? []), game]);
        return [...grouped]
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, items]) => {
                const centers = new Map<string, Game[]>();
                for (const game of [...items].sort(
                    (a, b) => a.sequence - b.sequence || a.id - b.id,
                )) {
                    const center = game.center || "경기장 미등록";
                    centers.set(center, [...(centers.get(center) ?? []), game]);
                }
                return { date, ...stats(items), centers: [...centers] };
            });
    });
    const trend = $derived(
        [...days].reverse().filter((day) => day.average != null),
    );
    const chartX = (date: string) => {
        const first = Date.parse(trend[0]?.date ?? date);
        const last = Date.parse(trend.at(-1)?.date ?? date);
        return first === last
            ? 300
            : 40 + ((Date.parse(date) - first) / (last - first)) * 520;
    };
    const chartY = (score: number) => 170 - (score / 300) * 150;
    const points = $derived(
        trend
            .map((day) => `${chartX(day.date)},${chartY(day.average!)}`)
            .join(" "),
    );

</script>

<section
    class="w-100 py-3"
    aria-labelledby={`${uid}-title`}
    style="font-variant-numeric: tabular-nums;"
>
    <header
        class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"
    >
        <div>
            <h2 id={`${uid}-title`} class="h4 fw-bold mb-1">개인 기록</h2>
            <p class="small text-body-secondary mb-0">
                나의 게임 기록과 점수 변화를 확인하세요.
            </p>
        </div>
        <Button color="primary" onclick={() => { addOpen = true; }}>개인 게임 기록 추가</Button>
    </header>
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <span class="small text-body-secondary">{startDate} ~ {endDate}</span>
        <Button color="primary" outline onclick={() => { periodOpen = true; }}>기간 변경</Button>
    </div>
    <Alert color="info">미리보기용 예시 데이터입니다. 입력한 기록도 서버에 저장되지 않으며 새로고침하면 초기화됩니다.</Alert>
    {#if notice}<p class="small text-primary" role="status">{notice}</p>{/if}

    <div class="row row-cols-3 g-2 mb-3">
        {#each [{ label: "기간 평균", value: summary.average, digits: 2 }, { label: "최고 점수", value: summary.highest, digits: 0 }, { label: "총 게임 수", value: summary.count, digits: 0 }] as metric}
            <div class="col">
                <Card class="h-100 bg-body-tertiary"
                    ><CardBody class="p-3"
                        ><h3 class="small text-body-secondary fw-normal">
                            {metric.label}
                        </h3>
                        <p class="fs-4 fw-semibold text-primary mb-0">
                            {status === "ready"
                                ? format(metric.value, metric.digits)
                                : "—"}
                        </p></CardBody
                    ></Card
                >
            </div>
        {/each}
    </div>
    <Card class="mb-4"
        ><CardBody>
            <h3 class="h6 fw-bold">점수 변화</h3>
            <p class="small text-body-secondary">
                경기 날짜별 평균 점수 · 300점 기준
            </p>
            {#if status === "ready" && trend.length}
                <svg
                    viewBox="0 0 600 200"
                    class="w-100"
                    role="img"
                    aria-labelledby={`${uid}-chart`}
                >
                    <title id={`${uid}-chart`}
                        >선택 기간의 날짜별 평균 점수. 정확한 값은 아래 날짜별
                        기록에서 확인할 수 있습니다.</title
                    >
                    {#each [0, 100, 200, 300] as tick}
                        <line
                            x1="40"
                            x2="560"
                            y1={chartY(tick)}
                            y2={chartY(tick)}
                            stroke="var(--bs-border-color)"
                        />
                        <text
                            x="30"
                            y={chartY(tick) + 4}
                            text-anchor="end"
                            fill="currentColor"
                            font-size="12">{tick}</text
                        >
                    {/each}
                    <polyline
                        {points}
                        fill="none"
                        stroke="var(--bs-primary)"
                        stroke-width="2"
                    />
                    {#each trend as day}<circle
                            cx={chartX(day.date)}
                            cy={chartY(day.average!)}
                            r="3"
                            fill="var(--bs-primary)"
                            ><title
                                >{day.date}: {format(day.average, 2)}점</title
                            ></circle
                        >{/each}
                    <text x="40" y="195" fill="currentColor" font-size="12"
                        >{trend[0].date}</text
                    >
                    {#if trend.length > 1}<text
                            x="560"
                            y="195"
                            text-anchor="end"
                            fill="currentColor"
                            font-size="12">{trend.at(-1)?.date}</text
                        >{/if}
                </svg>
            {:else}<p class="text-center text-body-secondary py-4 mb-0">
                    {status === "ready"
                        ? "표시할 점수 기록이 없습니다."
                        : "기록이 연결되면 점수 변화를 표시합니다."}
                </p>{/if}
        </CardBody></Card
    >

    <h3 class="h5 fw-semibold mb-3">날짜별 기록</h3>
    {#if status === "ready" && !days.length}<p
            class="text-body-secondary py-3"
            role="status"
        >
            선택한 기간에 기록이 없습니다.
        </p>
    {:else if status !== "ready"}<p class="text-body-secondary small">
            기록 조회 후 날짜별 게임과 경기장을 확인할 수 있습니다.
        </p>
    {:else}
        <div class="d-flex flex-column gap-3">
            {#each days as day (day.date)}
                <Card
                    ><CardBody>
                        <h4 class="h6 fw-bold">{day.date}</h4>
                        <p class="small text-body-secondary">
                            평균 {format(day.average, 2)} · 최고 {format(
                                day.highest,
                            )} · {day.count}게임
                        </p>
                        {#each day.centers as [center, items]}
                            <h5 class="small fw-semibold mt-3">{center}</h5>
                            <ul
                                class="row row-cols-2 row-cols-sm-4 g-2 list-unstyled mb-0"
                            >
                                {#each items as game (game.id)}
                                    <li class="col">
                                        <div
                                            class="border rounded-3 text-center p-2"
                                        >
                                            <span
                                                class="small text-body-secondary"
                                                >{game.sequence}게임</span
                                            >
                                            <strong
                                                class="d-block fs-4 text-primary"
                                                >{format(game.score)}</strong
                                            >
                                            <Badge
                                                color={game.type === "regular"
                                                    ? "primary"
                                                    : "secondary"}
                                                >{game.type === "regular"
                                                    ? "정기전"
                                                    : "개인"}</Badge
                                            >
                                        </div>
                                    </li>
                                {/each}
                            </ul>
                        {/each}
                    </CardBody></Card
                >
            {/each}
        </div>
    {/if}
</section>

<PersonalRecordPeriod bind:isOpen={periodOpen} {startDate} {endDate} onApply={applyPeriod} />
<AddPersonalRecord bind:isOpen={addOpen} onPreview={addPreview} />
