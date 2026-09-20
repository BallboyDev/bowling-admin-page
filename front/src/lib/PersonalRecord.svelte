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
    import { callApi } from "./api/callApi";
    import Footer from "./components/Footer.svelte";

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
    let memberId = $state<number | null>(1);
    let periodOpen = $state(false);
    let addOpen = $state(false);
    const currentYear = new Date().getFullYear();
    let startDate = $state(`${currentYear}-01-01`);
    let endDate = $state(`${currentYear}-12-31`);
    let games = $state<Game[]>([]);
    let recordScope = $state<"all" | "regular">("all");
    const filteredGames = $derived(
        recordScope === "regular"
            ? games.filter((game) => game.type === "regular")
            : games,
    );
    let status = $state<"loading" | "ready" | "error">("loading");
    let notice = $state("");
    let refresh = $state(0);

    $effect(() => {
        if (!selected) return;
        void refresh;
        let active = true;
        status = "loading";
        games = [];
        callApi(
            `/api/games/${memberId}?start=${startDate}&end=${endDate}`,
            "GET",
        )
            .then((res) => {
                if (!active) return;
                if (!Array.isArray(res?.games))
                    throw new Error("Invalid games response");
                games = res.games;
                status = "ready";
            })
            .catch(() => {
                if (active) status = "error";
            });
        return () => {
            active = false;
        };
    });

    const applyPeriod = (
        start: string,
        end: string,
        scope: "all" | "regular",
    ) => {
        recordScope = scope;
        startDate = start;
        endDate = end;
        notice = "";
        periodOpen = false;
    };
    const handleSaved = (date: string) => {
        addOpen = false;
        notice =
            date < startDate || date > endDate
                ? "기록을 저장했습니다. 조회 기간 밖의 기록이므로 기간을 변경하면 확인할 수 있습니다."
                : "기록을 저장했습니다.";
        if (recordScope === "regular") {
            notice +=
                " 개인 기록을 확인하려면 조회 범위를 ‘모두 조회’로 변경해 주세요.";
        }
        refresh += 1;
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
    const summary = $derived(stats(filteredGames));
    const days = $derived.by(() => {
        const grouped = new Map<string, Game[]>();
        for (const game of filteredGames)
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
        <Button
            color="primary"
            onclick={() => {
                addOpen = true;
            }}>개인 게임 기록 추가</Button
        >
    </header>
    <div
        class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3"
    >
        <span class="small text-body-secondary"
            >{startDate} ~ {endDate} · {recordScope === "all"
                ? "모두 조회"
                : "정기전만 조회"}</span
        >
        <Button
            color="primary"
            outline
            onclick={() => {
                periodOpen = true;
            }}>조회 조건 변경</Button
        >
    </div>
    {#if notice}<p class="small text-primary" role="status">{notice}</p>{/if}
    {#if status === "loading"}
        <p class="text-body-secondary" role="status">
            기록을 불러오는 중입니다.
        </p>
    {:else if status === "error"}
        <Alert color="danger">
            <p role="alert">
                {notice
                    ? "저장은 완료되었지만 목록을 불러오지 못했습니다."
                    : "기록을 불러오지 못했습니다."} 다시 시도해 주세요.
            </p>
            <Button
                color="danger"
                outline
                onclick={() => {
                    refresh += 1;
                }}>다시 조회</Button
            >
        </Alert>
    {/if}

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
                        : status === "loading"
                          ? "기록을 불러오는 중입니다."
                          : "기록을 조회하지 못했습니다."}
                </p>{/if}
        </CardBody></Card
    >

    <h3 class="h5 fw-semibold mb-3">날짜별 기록</h3>
    {#if status === "ready" && !days.length}<p
            class="text-body-secondary py-3"
            role="status"
        >
            선택한 기간과 조회 범위에 해당하는 기록이 없습니다.
        </p>
    {:else if status !== "ready"}<p class="text-body-secondary small">
            {status === "loading"
                ? "날짜별 기록을 불러오는 중입니다."
                : "다시 조회하면 날짜별 기록을 확인할 수 있습니다."}
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
    <Footer />
</section>

<PersonalRecordPeriod
    bind:isOpen={periodOpen}
    {startDate}
    {endDate}
    {recordScope}
    onApply={applyPeriod}
/>
<AddPersonalRecord
    bind:isOpen={addOpen}
    onSaved={handleSaved}
    memberId={memberId ?? undefined}
/>
