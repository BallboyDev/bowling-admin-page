<script lang="ts">
    import RegistNotice from "$lib/components/RegistNotice.svelte";
    import RegistPlayer from "$lib/components/RegistPlayer.svelte";
    import dayjs from "dayjs";
    import { onMount } from "svelte";

    let title = $state(dayjs().format("YYYY-MM-DD"));

    let { data } = $props();

    $effect(() => {
        console.log(title);
        console.log(Date);
        console.log(dayjs().format("YYYY-MM-DD"));
    });
</script>

<h1>관리자 페이지</h1>

<input type="Date" class="title" bind:value={title} />

<div class="content">
    <RegistPlayer players={data.list} date={title} />
    <!-- <div class="regist-player"></div> -->

    <RegistNotice />
</div>

<style lang="scss">
    h1 {
        margin-bottom: 1rem;
    }
    .title {
        width: 20rem;
        height: 2rem;
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }
    .content {
        display: flex;
        width: 100%;
    }
</style>
