<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        ButtonGroup,
        Card,
        CardBody,
        Input,
        Modal,
        ModalBody,
        ModalHeader,
        Progress,
        Spinner,
    } from "@sveltestrap/sveltestrap";
    import { callApi } from "./api/callApi";
    import Footer from "./components/Footer.svelte";

    interface MemberStatistics {
        memberId: number;
        memberName: string;
        memberGrade: number;
        attendanceCount: number;
        attendanceRate: number | null;
        attendanceRank: number | null;
        gameCount: number;
        averageScore: number | null;
        scoreRank: number | null;
        deviation: number | null;
        highRow: number | null;
    }

    const { selected = true }: { selected?: boolean } = $props();
    const uid = $props.id();
    let year = $state<number>(2026);
    let memberData = $state<MemberStatistics[]>([]);
    let isLoading = $state(true);
    let errorMessage = $state("");
    let retry = $state(0);
    let mode = $state<"score" | "attendance">("score");
    let query = $state("");
    let sort = $state("rank");
    let detail = $state<MemberStatistics | null>(null);
    let isOpen = $state(false);

    const rankKey = $derived(mode === "score" ? "scoreRank" : "attendanceRank");
    const clubMembers = $derived(
        memberData.filter((member) => member.memberId < 10000),
    );
    const totalGames = $derived(
        clubMembers.reduce((sum, member) => sum + member.gameCount, 0),
    );
    const recordedCount = $derived(
        clubMembers.filter((member) => member.gameCount > 0).length,
    );
    interface GradeTotal {
        totalScore: number;
        gameCount: number;
        averageScore: number | null;
    }
    interface GradeStatistics {
        year: number;
        grades: (GradeTotal & { grade: number })[];
        combined: GradeTotal;
    }
    let gradeData = $state<GradeStatistics | null>(null);
    let gradeLoading = $state(true);
    let gradeError = $state("");
    let gradeRetry = $state(0);
    const averages = $derived([
        {
            label: "클럽 통합",
            value: gradeData?.combined.averageScore ?? null,
            color: "primary",
        },
        {
            label: "1군",
            value:
                gradeData?.grades.find((item) => item.grade === 1)
                    ?.averageScore ?? null,
            color: "success",
        },
        {
            label: "2군",
            value:
                gradeData?.grades.find((item) => item.grade === 2)
                    ?.averageScore ?? null,
            color: "info",
        },
    ] as const);
    $effect(() => {
        if (!selected) return;
        void retry;
        void gradeRetry;
        let active = true;
        gradeLoading = true;
        gradeError = "";
        gradeData = null;
        callApi(`/api/games/grade-statistics?year=${year}`, "GET")
            .then((result: GradeStatistics) => {
                if (active) gradeData = result;
            })
            .catch(() => {
                if (active) gradeError = "그룹별 평균을 불러오지 못했습니다.";
            })
            .finally(() => {
                if (active) gradeLoading = false;
            });
        return () => {
            active = false;
        };
    });

    const hasRecord = (member: MemberStatistics) =>
        member.gameCount > 0 || member.attendanceCount > 0;
    const eligible = (member: MemberStatistics) =>
        member.attendanceRate != null && member.attendanceRate >= 20;
    const rankings = $derived.by(() => {
        const result = {
            scoreRank: new Map<number, number>(),
            attendanceRank: new Map<number, number>(),
        };
        for (const key of ["scoreRank", "attendanceRank"] as const) {
            const metric =
                key === "scoreRank" ? "averageScore" : "attendanceCount";
            const candidates = memberData
                .filter((member) => eligible(member) && member[metric] != null)
                .sort(
                    (a, b) =>
                        b[metric]! - a[metric]! || a.memberId - b.memberId,
                );
            let rank = 0;
            candidates.forEach((member, index) => {
                if (
                    index === 0 ||
                    member[metric] !== candidates[index - 1][metric]
                )
                    rank = index + 1;
                result[key].set(member.memberId, rank);
            });
        }
        return result;
    });
    const memberRank = (
        member: MemberStatistics,
        key: "scoreRank" | "attendanceRank",
    ) => rankings[key].get(member.memberId) ?? null;
    const rankCounts = $derived.by(() => {
        const counts = new Map<number, number>();
        for (const member of memberData) {
            const rank = memberRank(member, rankKey);
            if (rank != null) counts.set(rank, (counts.get(rank) ?? 0) + 1);
        }
        return counts;
    });
    const filteredMembers = $derived.by(() =>
        memberData
            .filter((member) => member.memberName.includes(query.trim()))
            .sort((a, b) => {
                const guestOrder =
                    Number(a.memberId >= 10000) - Number(b.memberId >= 10000);
                if (guestOrder) return guestOrder;
                const recordOrder =
                    Number(!hasRecord(a)) - Number(!hasRecord(b));
                if (recordOrder) return recordOrder;
                const byName =
                    a.memberName.localeCompare(b.memberName, "ko") ||
                    a.memberId - b.memberId;
                if (sort === "name") return byName;
                if (sort === "games")
                    return b.gameCount - a.gameCount || byName;
                return (
                    (memberRank(a, rankKey) ?? Infinity) -
                        (memberRank(b, rankKey) ?? Infinity) || byName
                );
            }),
    );

    const formatNumber = (value: number | null, digits = 0) =>
        value == null
            ? "—"
            : value.toLocaleString("ko-KR", {
                  minimumFractionDigits: digits,
                  maximumFractionDigits: digits,
              });
    const signed = (value: number | null) =>
        `${value != null && value > 0 ? "+" : ""}${formatNumber(value, 2)}`;
    const rankText = (
        member: MemberStatistics,
        key: "scoreRank" | "attendanceRank",
    ) => {
        if (!eligible(member)) return "순위 제외";
        const rank = memberRank(member, key);
        if (rank == null) return "순위 없음";
        const tied =
            memberData.filter((item) => memberRank(item, key) === rank).length >
            1;
        return `${tied ? "공동 " : ""}${rank}위`;
    };
    const switchMode = (next: "score" | "attendance") => {
        mode = next;
        sort = "rank";
    };
    const closeDetail = () => {
        isOpen = false;
    };

    $effect(() => {
        if (!selected) return;
        void retry;
        let active = true;
        isLoading = true;
        errorMessage = "";
        callApi(`/api/members/statistics?year=${year}`, "GET")
            .then((res) => {
                if (active) memberData = res;
            })
            .catch(() => {
                if (active)
                    errorMessage =
                        "회원 기록을 불러오지 못했습니다. 다시 시도해 주세요.";
            })
            .finally(() => {
                if (active) isLoading = false;
            });
        return () => {
            active = false;
        };
    });
</script>

<!-- <section
    style="max-width: 66.25rem; font-variant-numeric: tabular-nums;"
    class="activity-records p-3 p-md-4 rounded-4 w-100 mx-auto bg-body-tertiary text-body mt-3"
    aria-labelledby={`${uid}-title`}
> -->
<section class="w-100 py-3" aria-labelledby={`${uid}-title`}>
    <header
        class="d-flex flex-column flex-md-row align-items-md-center align-items-start justify-content-between gap-3 mb-4"
    >
        <h2 class="h4 fw-bold mb-0" id={`${uid}-title`}>{year}년 클럽 기록</h2>
        <!-- <span class="small px-3 py-2 bg-body border rounded-3 text-nowrap"
            >{year}년 활동 기록</span
        > -->
        <!-- <div class="d-flex gap-2 gap-md-3"> -->
        <!-- <Button
                size="sm"
                outline
                color={year === 2026 ? "light" : "secondary"}
                onclick={() => ((retry += 1), (year = 2026))}
            >
                2026년 활동 기록
            </Button> -->
        <!-- <Button
                size="sm"
                outline
                color={year === 2027 ? "light" : "secondary"}
                onclick={() => ((retry += 1), (year = 2027))}
            >
                2027년 활동 기록
            </Button> -->
        <!-- </div> -->
    </header>

    <div class="d-flex flex-column gap-3 gap-md-4">
        <Card class="rounded-4 overflow-hidden">
            <div class="row g-0">
                <div class="col-12 col-md-5 bg-primary text-white p-4">
                    <h3 class="h6 fw-normal mb-2">전체 누적 게임</h3>
                    <p class="display-5 fw-semibold mb-3">
                        {isLoading || errorMessage
                            ? "—"
                            : formatNumber(totalGames)}<span
                            class="fs-6 fw-normal ms-1">게임</span
                        >
                    </p>
                    <div
                        class="d-flex justify-content-between gap-3 border-top border-white border-opacity-25 pt-3"
                    >
                        <div>
                            <span class="d-block small mb-1">전체 회원</span
                            ><strong class="fs-4"
                                >{isLoading || errorMessage
                                    ? "—"
                                    : formatNumber(clubMembers.length)}</strong
                            ><span class="small ms-1">명</span>
                        </div>
                        <div>
                            <span class="d-block small mb-1">기록 보유</span
                            ><strong class="fs-4"
                                >{isLoading || errorMessage
                                    ? "—"
                                    : formatNumber(recordedCount)}</strong
                            ><span class="small ms-1">명</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-7 p-4">
                    <h3 class="h6 fw-semibold mb-2">그룹별 평균 점수</h3>
                    <p class="small text-body-secondary mb-3">
                        게스트 제외 · 300점 기준
                    </p>
                    {#if gradeLoading}
                        <p class="small text-body-secondary" role="status">
                            <Spinner size="sm" class="me-2" />그룹별 평균을
                            불러오는 중입니다.
                        </p>
                    {:else if gradeError}
                        <Alert color="danger">{gradeError}</Alert><Button
                            color="primary"
                            outline
                            onclick={() => gradeRetry++}>다시 시도</Button
                        >
                    {:else}
                        <div class="d-flex flex-column gap-3">
                            {#each averages as item}
                                <div>
                                    <div
                                        class="d-flex justify-content-between gap-2 mb-1"
                                    >
                                        <span class="small">{item.label}</span
                                        ><strong
                                            >{formatNumber(
                                                item.value,
                                                2,
                                            )}{item.value == null
                                                ? ""
                                                : "점"}</strong
                                        >
                                    </div>
                                    <Progress
                                        value={item.value ?? 0}
                                        max={300}
                                        color={item.color}
                                        aria-label={`${item.label} ${item.value == null ? "기록 없음" : `평균 ${item.value}점`}`}
                                    />
                                </div>
                            {/each}
                        </div>
                    {/if}
                </div>
            </div>
        </Card>
        <p class="small text-body-secondary mb-0">
            상단 집계는 게스트를 제외합니다. 통합 평균은 1·2군의 총점 ÷ 게임
            수이며, 기록이 없으면 —로 표시합니다.
        </p>
        <Card class="rounded-4 overflow-hidden" style="min-width: 0;">
            <div class="p-3 p-md-4 pb-0 pb-md-0">
                <ButtonGroup
                    class="w-100 bg-body-tertiary p-1 gap-1 rounded-3"
                    aria-label="기록 종류"
                >
                    <Button
                        class="rounded-3 border-0 m-0 fw-semibold py-2"
                        color={mode === "score" ? "primary" : "light"}
                        aria-pressed={mode === "score"}
                        onclick={() => switchMode("score")}>점수 기록</Button
                    >
                    <Button
                        class="rounded-3 border-0 m-0 fw-semibold py-2"
                        color={mode === "attendance" ? "primary" : "light"}
                        aria-pressed={mode === "attendance"}
                        onclick={() => switchMode("attendance")}
                        >출석 기록</Button
                    >
                </ButtonGroup>
                <Input
                    class="py-2 mt-3 rounded-3"
                    type="search"
                    bind:value={query}
                    aria-label="회원 이름 검색"
                    placeholder="회원 이름을 검색하세요"
                    autocomplete="off"
                />
                <div
                    class="small py-2 d-flex justify-content-between align-items-center gap-2 text-body-secondary"
                >
                    <span role="status" aria-live="polite"
                        >{query.trim() ? "검색 결과" : "전체"}
                        <strong
                            >{isLoading || errorMessage
                                ? "—"
                                : filteredMembers.length}</strong
                        >명</span
                    >
                    <Input
                        type="select"
                        class="py-2 w-auto border-0"
                        bsSize="sm"
                        style="max-width: 10rem;"
                        bind:value={sort}
                        aria-label="정렬 기준"
                    >
                        <option value="rank"
                            >{mode === "score" ? "점수" : "출석"} 순위순</option
                        >
                        <option value="name">이름순</option>
                        <option value="games">게임 많은순</option>
                    </Input>
                </div>
            </div>
            <div
                class="small px-3 px-md-4 pb-2 d-flex justify-content-between border-bottom text-body-secondary"
            >
                <span>순위 · 회원</span><span
                    >{mode === "score" ? "평균 점수" : "출석률"}</span
                >
            </div>
            {#if isLoading}
                <div
                    class="small py-5 px-4 text-center text-body-secondary"
                    role="status"
                >
                    <Spinner size="sm" class="me-2" />회원 기록을 불러오는
                    중입니다.
                </div>
            {:else if errorMessage}
                <div class="p-3">
                    <Alert color="danger">{errorMessage}</Alert><Button
                        color="primary"
                        outline
                        onclick={() => (retry += 1)}>다시 시도</Button
                    >
                </div>
            {:else if filteredMembers.length === 0}
                <div
                    class="small py-5 px-4 text-center text-body-secondary"
                    role="status"
                >
                    {query.trim()
                        ? "검색된 회원이 없습니다. 이름을 다시 확인해 주세요."
                        : "표시할 회원 기록이 없습니다."}
                </div>
            {:else}
                <ul class="list-unstyled p-0 m-0">
                    {#each filteredMembers as member (member.memberId)}
                        {@const rank = memberRank(member, rankKey)}
                        <li class="border-bottom">
                            <Button
                                color="link"
                                style="grid-template-columns: 2rem minmax(0, 1fr) auto; min-height: 5.75rem;"
                                class="member-row gap-2 gap-md-3 p-3 px-md-4 d-grid align-items-center w-100 text-start text-body text-decoration-none border-0 rounded-0"
                                aria-label={`${member.memberName}, ${rankText(member, rankKey)}, 상세 기록 보기`}
                                onclick={() => {
                                    detail = member;
                                    isOpen = true;
                                }}
                            >
                                <span
                                    class:bg-primary-subtle={rank != null &&
                                        rank <= 3}
                                    class:text-primary-emphasis={rank != null &&
                                        rank <= 3}
                                    class:text-body-secondary={rank == null ||
                                        rank > 3}
                                    class="small rounded-3 py-1 text-center fw-semibold"
                                >
                                    {#if rank != null && (rankCounts.get(rank) ?? 0) > 1}<small
                                            class="d-block fw-normal"
                                            >공동</small
                                        >{/if}
                                    {rank ?? "—"}
                                </span>
                                <span style="min-width: 0;">
                                    <span class="text-break fw-semibold"
                                        >{member.memberName}</span
                                    >
                                    {#if member.memberId >= 10000}
                                        <Badge color="secondary" class="ms-2"
                                            >GUEST</Badge
                                        >
                                    {:else}
                                        <Badge
                                            color={member.memberGrade === 1
                                                ? "primary"
                                                : "info"}
                                            class="ms-2"
                                            >{member.memberGrade}군</Badge
                                        >
                                    {/if}
                                    <span
                                        class="small d-block mt-1 text-body-secondary"
                                        >{mode === "score"
                                            ? member.gameCount > 0
                                                ? `${formatNumber(member.gameCount)}게임 참여`
                                                : "경기 기록 없음"
                                            : `${formatNumber(member.attendanceCount)}회 출석`}</span
                                    >
                                    {#if mode === "attendance"}
                                        <span
                                            class="d-block mt-2"
                                            style="max-width: 8.75rem;"
                                            aria-hidden="true"
                                            ><Progress
                                                style="height: 0.25rem;"
                                                color="primary"
                                                value={Math.min(
                                                    100,
                                                    Math.max(
                                                        0,
                                                        member.attendanceRate ??
                                                            0,
                                                    ),
                                                )}
                                            /></span
                                        >
                                    {/if}
                                </span>
                                <span class="text-end">
                                    <strong class="fs-4 fw-semibold"
                                        >{formatNumber(
                                            mode === "score"
                                                ? member.averageScore
                                                : member.attendanceRate,
                                            2,
                                        )}</strong
                                    >
                                    <span class="small ms-1 text-body-secondary"
                                        >{mode === "score"
                                            ? member.averageScore == null
                                                ? ""
                                                : "점"
                                            : member.attendanceRate == null
                                              ? ""
                                              : "%"}</span
                                    >
                                    {#if mode === "score" && member.deviation != null}
                                        <span
                                            class="small d-block mt-1"
                                            class:text-success-emphasis={member.deviation >=
                                                0}
                                            class:text-danger-emphasis={member.deviation <
                                                0}
                                            >평균 대비 {signed(
                                                member.deviation,
                                            )}</span
                                        >
                                    {/if}
                                </span>
                            </Button>
                        </li>
                    {/each}
                </ul>
            {/if}
            <p
                class="small lh-lg bg-body-tertiary py-3 px-4 m-0 border-top text-body-secondary"
            >
                {mode === "score"
                    ? "평균 대비는 전체 게임 평균과의 차이입니다. 경기 기록이 없는 항목은 —로 표시합니다."
                    : "출석률은 해당 연도 전체 정기전 대비 출석 비율입니다. 순위는 출석률 20% 이상 회원 기준이며 동률은 공동순위로 표시합니다."}
                출석률 20% 미만 또는 미등록 회원은 점수·출석 순위에서 제외합니다.
            </p>
        </Card>
    </div>
    <Footer />
</section>

<Modal
    {isOpen}
    toggle={closeDetail}
    centered
    scrollable
    labelledBy={`${uid}-detail-title`}
>
    <ModalHeader id={`${uid}-detail-title`}>
        {detail?.memberName}님의 기록
        <button
            slot="close"
            type="button"
            class="btn-close"
            aria-label="상세 기록 닫기"
            onclick={closeDetail}
        ></button>
    </ModalHeader>
    <ModalBody>
        {#if detail}
            <div
                class="small d-flex align-items-center justify-content-between bg-primary-subtle text-primary-emphasis p-3 rounded-4 mb-3"
            >
                <span
                    >평균 점수<strong class="d-block fs-2 mt-1"
                        >{formatNumber(detail.averageScore, 2)}<small
                            class="fs-6 fw-normal"
                            >{detail.averageScore == null ? "" : " 점"}</small
                        ></strong
                    ></span
                >
                <span class="text-primary">{year}</span>
            </div>
            <dl class="small m-0" style="font-variant-numeric: tabular-nums;">
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">회원번호</dt>
                    <dd class="m-0 text-end">{detail.memberId}</dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">점수 순위</dt>
                    <dd class="m-0 text-end">
                        {rankText(detail, "scoreRank")}
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">총 게임 수</dt>
                    <dd class="m-0 text-end">
                        {formatNumber(detail.gameCount)}게임
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">
                        전체 평균 대비
                    </dt>
                    <dd class="m-0 text-end">
                        {signed(detail.deviation)}{detail.deviation == null
                            ? ""
                            : "점"}
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">최고−최저</dt>
                    <dd class="m-0 text-end">
                        {formatNumber(detail.highRow)}{detail.highRow == null
                            ? ""
                            : "점"}
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">출석 횟수</dt>
                    <dd class="m-0 text-end">
                        {formatNumber(detail.attendanceCount)}회
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">출석률</dt>
                    <dd class="m-0 text-end">
                        {formatNumber(
                            detail.attendanceRate,
                            2,
                        )}{detail.attendanceRate == null ? "" : "%"}
                    </dd>
                </div>
                <div
                    class="d-flex justify-content-between gap-3 py-3 border-bottom"
                >
                    <dt class="text-body-secondary fw-normal">출석 순위</dt>
                    <dd class="m-0 text-end">
                        {rankText(detail, "attendanceRank")}
                    </dd>
                </div>
            </dl>
            <p class="small lh-lg mt-3 mb-0 text-body-secondary">
                최고−최저는 개인 최고점과 최저점의 차이입니다. 기록이 없는
                항목은 —로 표시합니다.
            </p>
        {/if}
    </ModalBody>
</Modal>
