<script lang="ts">
    import {
        Alert,
        Badge,
        Button,
        Card,
        CardBody,
        Input,
    } from "@sveltestrap/sveltestrap";
    import ImageUpload from "./components/ImageUpload.svelte";
    import DrawWinner from "./components/DrawWinner.svelte";
    import SaveRecords from "./components/SaveRecords.svelte";

    interface Game {
        score: number | null;
        confidence: number;
    }
    interface Player {
        name: string;
        game1: Game;
        game2: Game;
        game3: Game;
        game4: Game;
    }
    const uid = $props.id();
    const keys = ["game1", "game2", "game3", "game4"] as const;
    let scoreList = $state<Player[]>([]);
    let imageUploadOpen = $state(false);
    let saveOpen = $state(false);
    let drawOpen = $state(false);
    let winnerIndex = $state<number | null>(null);
    let drawRound = $state(0);
    const canDraw = $derived(scoreList.length > 0 && scoreList.every((row) => row.name.trim().length > 0));
    const winnerName = $derived(winnerIndex == null ? null : scoreList[winnerIndex]?.name.trim() || null);
    const draw = () => {
        if (!canDraw) return;
        // Rejection sampling gives every participant row the same chance.
        const count = scoreList.length;
        const limit = Math.floor(0x100000000 / count) * count;
        const random = new Uint32Array(1);
        do { crypto.getRandomValues(random); } while (random[0] >= limit);
        winnerIndex = random[0] % count;
        drawRound++;
        drawOpen = true;
    };
    let selectImage = $state<File | null>(null);
    let previewUrl = $state("");
    let errors = $state<Record<string, string>>({});
    const valid = (score: number | null): score is number =>
        typeof score === "number" &&
        Number.isInteger(score) &&
        score >= 0 &&
        score <= 300;
    const needsReview = (game: Game) =>
        game.score != null &&
        (!Number.isFinite(game.confidence) || game.confidence < 95);
    const stats = (row: Player) => {
        const scores = keys.map((key) => row[key].score).filter(valid);
        const total = scores.reduce((sum, score) => sum + score, 0);
        return {
            total,
            count: scores.length,
            average: scores.length ? (total / scores.length).toFixed(2) : "—",
        };
    };
    const reviewCount = $derived(
        scoreList.reduce(
            (count, row) =>
                count + keys.filter((key) => needsReview(row[key])).length,
            0,
        ),
    );
    const canSave = $derived(
        scoreList.length > 0 &&
            Object.keys(errors).length === 0 &&
            scoreList.every(
                (row) =>
                    row.name.trim() &&
                    keys.some((key) => valid(row[key].score)) &&
                    keys.every(
                        (key) =>
                            row[key].score == null || valid(row[key].score),
                    ),
            ),
    );
    const hasZero = $derived(
        scoreList.some((row) => keys.some((key) => row[key].score === 0)),
    );

    // Clear validation belonging to the previous image when analysis replaces the list.
    $effect(() => {
        void scoreList;
        errors = {};
        winnerIndex = null;
        drawOpen = false;
    });
    const changeScore = (
        event: Event,
        index: number,
        key: (typeof keys)[number],
    ) => {
        const input = event.currentTarget as HTMLInputElement;
        const text = input.value.trim();
        const errorKey = `${index}-${key}`;
        const score = text === "" ? null : Number(text);
        if (input.validity.badInput || (score != null && !valid(score))) {
            errors[errorKey] = "0~300 사이의 정수를 입력해 주세요.";
            return;
        }
        delete errors[errorKey];
        scoreList[index][key] = { score, confidence: 100 };
    };
</script>

<section class="w-100 py-3" aria-labelledby={`${uid}-title`}>
    <header
        class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"
    >
        <div>
            <h2 id={`${uid}-title`} class="h4 fw-bold mb-1">정기전 진행</h2>
            <p class="small text-body-secondary mb-0">
                사진 업로드 → 점수 확인·수정 → 저장
            </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
            <Button
                color="primary"
                class="py-2"
                onclick={() => {
                    imageUploadOpen = true;
                }}
                ><i class="bi bi-camera me-2" aria-hidden="true"></i>점수 사진
                업로드</Button
            >
            <Button
                color="primary"
                outline
                class="py-2"
                disabled={!canSave}
                onclick={() => {
                    if (canSave) saveOpen = true;
                }}>저장</Button
            >
            <Button color="primary" outline class="py-2" disabled={!canDraw} onclick={draw}
                >뽑기</Button
            >
        </div>
    </header>
    {#if winnerName}
        <div class="border rounded-3 bg-primary-subtle text-primary-emphasis p-3 mb-3" role="status">
            <i class="bi bi-trophy me-2" aria-hidden="true"></i>뽑기 당첨자: <strong>{winnerName}</strong>
            <Button color="link" class="ms-2" onclick={() => { drawOpen = true; }}>결과 보기</Button>
        </div>
    {/if}
    {#if scoreList.length === 0}
        <Card class="bg-body-tertiary rounded-3"
            ><CardBody class="p-4 p-md-5 text-center">
                <img src="/gbc.png" alt="개빡세 볼링클럽" class="img-fluid" style="max-width: 10rem;" />
                <h3 class="h5 fw-semibold mt-3">점수 사진을 등록해 주세요</h3>
                <p class="small text-body-secondary mb-0">
                    점수표를 촬영하거나 이미지를 업로드하면 회원별 점수를
                    확인하고 수정할 수 있습니다.
                </p>
            </CardBody></Card
        >
    {:else}
        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
            <span class="small text-body-secondary"
                >참가 기록 <strong class="text-body">{scoreList.length}</strong
                >명</span
            >
            {#if reviewCount}<Badge color="warning"
                    >확인 필요 {reviewCount}개</Badge
                >{/if}
        </div>
        <p class="small text-body-secondary">
            인식 신뢰도가 95% 미만이면 ‘확인 필요’로 표시합니다. 점수를 확인한
            뒤 입력값을 확정해 주세요. 빈칸은 미입력, 0은 실제 0점입니다.
        </p>
        {#if hasZero}<Alert color="warning"
                >화면에서는 0점을 게임 수에 포함합니다. 현재 저장 API는 0점을
                게임 수와 개별 게임 기록에서 제외하므로, 0점의 정확한 저장은
                서버 개선이 필요합니다.</Alert
            >{/if}
        {#if !canSave}<p class="small text-danger" role="status">
                모든 회원의 이름과 최소 1게임의 유효한 점수를 확인해 주세요.
                입력 오류가 있으면 저장할 수 없습니다.
            </p>{/if}
        <ul class="row row-cols-1 row-cols-lg-2 g-3 list-unstyled mb-0">
            {#each scoreList as row, index}
                {@const info = stats(row)}
                <li class="col">
                    <Card class="h-100 rounded-3"
                        ><CardBody class="p-3">
                            <div
                                class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2"
                            >
                                <div class="flex-grow-1" style="min-width: 0;">
                                    <label class="form-label small text-body-secondary" for={`${uid}-name-${index}`}>회원 이름</label>
                                    <Input id={`${uid}-name-${index}`} bind:value={row.name} class="fw-semibold" invalid={!row.name.trim()} placeholder="회원 이름을 입력하세요" />
                                    {#if !row.name.trim()}<span class="small text-danger">이름을 입력해 주세요.</span>{/if}
                                </div>
                                <span class="small text-body-secondary"
                                    >평균 <strong class="fs-5 text-primary"
                                        >{info.average}</strong
                                    ></span
                                >
                            </div>
                            <p class="small text-body-secondary mb-3">
                                총점 {info.total} · {info.count}게임
                            </p>
                            <div class="row row-cols-4 g-2">
                                {#each keys as key, gameIndex}
                                    {@const game = row[key]}
                                    {@const errorKey = `${index}-${key}`}
                                    {@const invalid =
                                        !!errors[errorKey] ||
                                        (game.score != null &&
                                            !valid(game.score))}
                                    <div class="col">
                                        <label
                                            class="form-label small text-body-secondary"
                                            for={`${uid}-${errorKey}`}
                                            >{gameIndex + 1}게임</label
                                        >
                                        <Input
                                            id={`${uid}-${errorKey}`}
                                            type="number"
                                            min={0}
                                            max={300}
                                            step={1}
                                            inputmode="numeric"
                                            class={`text-center py-2 ${valid(game.score) && game.score >= 200 ? "border-danger text-danger" : "border-primary text-primary"}`}
                                            value={game.score ?? ""}
                                            placeholder="—"
                                            {invalid}
                                            aria-label={`${row.name || "회원"} ${gameIndex + 1}게임 점수`}
                                            aria-describedby={invalid
                                                ? `${uid}-${errorKey}-error`
                                                : needsReview(game)
                                                  ? `${uid}-${errorKey}-review`
                                                  : undefined}
                                            onchange={(event: Event) =>
                                                changeScore(event, index, key)}
                                        />
                                        {#if invalid}<span
                                                id={`${uid}-${errorKey}-error`}
                                                class="d-block small text-danger mt-1"
                                                >0~300 정수 입력</span
                                            >
                                        {:else if needsReview(game)}<span
                                                id={`${uid}-${errorKey}-review`}
                                                class="d-block small text-warning-emphasis mt-1"
                                                >확인 필요</span
                                            >{/if}
                                    </div>
                                {/each}
                            </div>
                        </CardBody></Card
                    >
                </li>
            {/each}
        </ul>
    {/if}
</section>

<ImageUpload
    bind:isOpen={imageUploadOpen}
    bind:selectImage
    bind:previewUrl
    bind:scoreList
/>
<SaveRecords bind:isOpen={saveOpen} {scoreList} lotto={winnerName} />
<DrawWinner bind:isOpen={drawOpen} {winnerName} round={drawRound} canDraw={canDraw} onDraw={draw} />
