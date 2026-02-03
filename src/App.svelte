<script lang="ts">
    import {
        Button,
        Column,
        Input,
        Spinner,
        TabContent,
        Table,
        TabPane,
        Image,
    } from "@sveltestrap/sveltestrap";
    import Member from "./lib/memberAdmin/Member.svelte";
    import gasApi from "./lib/gas/gas";
    import { onMount } from "svelte";
    import Test from "./lib/develop/Test.svelte";
    import {
        gameState,
        memberState,
        settings,
        loadingState,
        authState,
    } from "./lib/state/state.svelte";
    import Game from "./lib/regularGame/Game.svelte";
    import Person from "./lib/personalRecord/Person.svelte";
    import Betting from "./lib/betting/Betting.svelte";

    // import { dataLoading } from "./lib/state/state.svelte";

    let login = $state(false);
    let name = $state("");
    let number = $state("");
    // 0: 일반 회원 / 1: 운영진 / 2: 관리자
    let auth: 0 | 1 | 2 = $state(0);

    const handle = {
        login: async () => {
            const temp = await gasApi.login(name, number);
            if (temp.length > 0) {
                const data = temp[0];
                localStorage.clear();
                localStorage.setItem("name", data[1]);
                localStorage.setItem("number", data[0]);

                if (data[2].includes("관리자")) {
                    auth = 2;
                } else if (
                    ["운영진", "회장", "총무"].some((v) => data[2].includes(v))
                ) {
                    auth = 1;
                } else if (data[2].includes("회원")) {
                    auth = 0;
                }

                // localStorage.setItem("auth", auth.toString());
                authState.auth = auth;

                login = true;
            }
        },
        test: async () => {
            const data = await gasApi.test();
            console.log(data);
        },
    };

    $effect(() => {
        if (!!login) {
            console.log("Data Loading...");
            settings();
        }
    });

    onMount(async () => {
        name = localStorage.getItem("name");
        number = localStorage.getItem("number");
        auth = parseInt(localStorage.getItem("auth") || "0") as 0 | 1 | 2;

        if (`${name || ""}${number || ""}`.length === 0) {
            localStorage.clear();
            login = false;
        } else {
            handle.login();
        }
    });
</script>

{#if loadingState.isLoading}
    <div
        class="position-fixed vh-100 vw-100 bg-dark bg-opacity-75 d-flex flex-column justify-content-center align-items-center z-3"
    >
        <!-- <Image alt="" src="/gbc.png" /> -->
        <Spinner type="border" size="lg" color="primary" />
    </div>
{/if}

<div class="p-3 h-100">
    {#if !login}
        <div class="box border p-3 rounded">
            <Input class="mb-3" placeholder="이름" bind:value={name} />
            <Input class="mb-3" placeholder="회원번호" bind:value={number} />
            <Button
                class="w-100"
                color="primary"
                onclick={() => {
                    handle.login();
                }}>Login</Button
            >
        </div>
    {:else}
        <TabContent
            class="overflow-scroll h-100"
            on:tab={(e) => {
                e.detail === "logout" &&
                    (localStorage.clear(), (login = false));
                name = "";
                number = "";
            }}
        >
            {#if authState.auth >= 1}
                <TabPane tabId="member" tab="회원 관리" active>
                    <Member />
                </TabPane>
            {/if}
            <TabPane tabId="record" tab="개인 기록">
                <Person />
            </TabPane>
            <TabPane tabId="game" tab="정기전">
                <Game />
            </TabPane>
            <TabPane tabId="betting" tab="삼바리">
                <Betting />
            </TabPane>
            <TabPane tabId="random" tab="랜덤 뽑기">
                <h1>Random</h1>
            </TabPane>
            {#if authState.auth === 2}
                <TabPane tabId="test" tab="TEST">
                    <Test />
                    <!-- <InputHandler /> -->
                </TabPane>
            {/if}
            <TabPane tabId="logout" tab="Logout"></TabPane>
        </TabContent>
    {/if}
</div>

<style>
    .box {
        width: 20rem;
        margin: 15vh auto;
    }
    :global(.logout) {
        right: 1rem;
    }
    :global(.nav-tabs) {
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        height: 2.5rem;
        white-space: nowrap;
    }
    :global(th, td:not(.ballboy)) {
        white-space: nowrap;
    }
</style>
