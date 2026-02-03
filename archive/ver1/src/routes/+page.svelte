<script lang="ts">
    import Betting from "$lib/components/Betting.svelte";
    import EventScore from "$lib/components/EventScore.svelte";
    import Login from "$lib/components/Login.svelte";
    import Notice from "$lib/components/Notice.svelte";
    import ScoreTable from "$lib/components/ScoreTable.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<Login />

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
