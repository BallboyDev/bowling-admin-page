<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import Title from "../components/Title.svelte";
    import Dashboard from "$lib/images/Dashboard.svelte";
    import UserInfo from "$lib/images/UserInfo.svelte";
    import Controller from "$lib/images/Controller.svelte";
    import { browser, building, dev, version } from "$app/environment";
    import Card from "./components/Period.svelte";
    import Period from "./components/Period.svelte";
    import Place from "./components/Place.svelte";
    import { Chart, registerables } from "chart.js";
    import RecordBadge from "./components/RecordBadge.svelte";

    // props, state value
    let userInfo = $state("");
    let memberName = $derived(userInfo.split("/")[0]);
    let memberNum = $derived(userInfo.split("/")[1]);

    Chart.register(...registerables);
    onMount(() => {
        // if (browser) {
        //     userInfo = localStorage.getItem("userInfo");
        // }
        userInfo = getStorage("userInfo");

        if (!userInfo) {
            location.href = "/";
        } else {
            // callApi.getScore();
        }
    });

    const handle = {};
    const callApi = {};
</script>

<div id="totalPage" class="w-100 vh-100 d-flex flex-column">
    <Title
        {memberName}
        {memberNum}
        navi={[
            {
                title: "점수",
                icon: Dashboard,
                onClick: () => {
                    location.href = "/score";
                },
            },
            {
                title: "필터",
                icon: Controller,
                onClick: () => {},
            },
            {
                title: "회원정보수정",
                icon: UserInfo,
                onClick: () => {},
            },
        ]}
    />

    <div class="contents m-3">
        <!-- 기간(일, 주, 월) 별 점수 통계 -->
        <Period />

        <!-- 볼링장 별 통계 -->
        <Place />

        <!-- 특별 기록 (최고점, 올커버, 700시리즈, 800시리즈, 퍼펙트, ) -->
        <RecordBadge />
    </div>
</div>

<style lang="scss">
    #totalPage {
        max-width: 576px;
    }
</style>
