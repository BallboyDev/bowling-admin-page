<script>
    // @ts-nocheck

    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    import Title from "../components/Title.svelte";

    let userInfo = $state({});

    onMount(() => {
        if (browser) {
            const temp = localStorage.getItem("userInfo");
            if (temp !== null) {
                userInfo = JSON.parse(temp);
            }
        }
    });
</script>

<Title title="메인 페이지" />

<div class="contents">
    <div class="loginInfo">
        {#if !!userInfo?.name === null}
            <h3>환영합니다. {userInfo.name}</h3>
        {:else}
            <input type="text" placeholder="로그인 정보" bind />
            <button onclick={() => {}}>login</button>
        {/if}
    </div>

    <a href="/admin">관리자 페이지</a>
    <br />
    <a href="/member">회원관리</a>
    <br />
    <a href="/score">점수</a>
    <br />
    <a href="/temp">임시</a>
    <br />
</div>

<style>
    .contents {
        padding: 1rem;

        & > .loginInfo {
            margin-bottom: 0.5rem;

            & > input {
                margin-right: 1rem;
                width: 8rem;
            }
            & > button {
                width: 2.5rem;
            }
        }
    }

    a {
        text-decoration: none;
        color: #cccccc;
    }
</style>
