<script lang="ts">
    import Betting from "$lib/components/Betting.svelte";
    import EventScore from "$lib/components/EventScore.svelte";
    import Notice from "$lib/components/Notice.svelte";
    import ScoreTable from "$lib/components/ScoreTable.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<h1>개빡세 X월 X주차 정기전</h1>

<div class="content">
    <div class="score">
        <!-- 점수판 -->
        <ScoreTable scores={data.scores} />

        <!-- 랜덤 스코어 -->
        <EventScore />
    </div>

    <div class="board">
        <!-- 공지사항 -->
        <Notice />

        <!-- 삼/오바리 -->
        <Betting />
    </div>
</div>

<style lang="scss">
    h1 {
        margin-bottom: 1rem;
    }
    .content {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;

        & > .score {
            display: flex;
            align-items: flex-start;
            width: 100%;
            height: 50%;
            margin-bottom: 1rem;
        }

        & > .board {
            height: 50%;
            display: flex;
        }
    }
</style>
