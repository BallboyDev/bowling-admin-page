<script lang="ts">
    import {
        Button,
        Column,
        Input,
        TabContent,
        Table,
        TabPane,
    } from "@sveltestrap/sveltestrap";
    import Member from "./lib/memberAdmin/Member.svelte";
    import gasApi from "./lib/gas/gas";
    import { onMount } from "svelte";
    import Test from "./lib/develop/Test.svelte";
    import { gameState, memberState, settings } from "./lib/state/state.svelte";
    import Game from "./lib/regularGame/Game.svelte";
    import InputHandler from "./lib/develop/InputHandler.svelte";
    import Person from "./lib/personalRecord/Person.svelte";
    import Betting from "./lib/betting/Betting.svelte";

    // import { dataLoading } from "./lib/state/state.svelte";

    let login = $state(true);
    let name = $state("");
    let number = $state("");

    const handle = {
        login: async () => {
            const data = await gasApi.login(name, number);
            if (data.length > 0) {
                localStorage.setItem("name", name);
                localStorage.setItem("number", number);
                login = true;
            }
        },
        test: async () => {
            const data = await gasApi.test();
            console.log(data);
        },
    };

    // $inspect(memberState).with((type, memberState) => {
    //     if (type === "update") {
    //         console.log(memberState);
    //     }
    // });
    // $inspect(gameState).with((type, gameState) => {
    //     if (type === "update") {
    //         console.log(gameState);
    //     }
    // });

    $effect(() => {
        console.log("Data Loading...");

        settings();
    });

    onMount(async () => {
        const storedName = localStorage.getItem("name");
        const storedNumber = localStorage.getItem("number");

        const data = await gasApi.login(storedName, storedNumber);

        if (data.length > 0) {
            login = true;
        } else {
            // localStorage.clear();
            // login = false;
        }
    });
</script>

<div class="p-3 h-100">
    {#if !login}
        <div class="box border p-3 rounded">
            <Input class="mb-3" placeholder="이름" bind:value={name} />
            <Input class="mb-3" placeholder="회원번호" bind:value={number} />
            <Button
                class="w-100"
                color="primary"
                onclick={() => {
                    console.log(name, number);
                    // login = true;
                    handle.login();
                }}>Login</Button
            >
        </div>
    {:else}
        <TabContent class="overflow-scroll h-100">
            <TabPane tabId="member" tab="회원 관리">
                <Member />
            </TabPane>
            <TabPane tabId="record" tab="개인 기록">
                <Person />
            </TabPane>
            <TabPane tabId="game" tab="정기전">
                <Game />
            </TabPane>
            <TabPane tabId="betting" tab="삼바리" active>
                <Betting />
            </TabPane>
            <TabPane tabId="random" tab="랜덤 뽑기">
                <h1>Random</h1>
            </TabPane>
            <TabPane tabId="test" tab="TEST">
                <Test />
                <!-- <InputHandler /> -->
            </TabPane>
        </TabContent>
    {/if}
</div>

<style>
    .box {
        width: 20rem;
        margin: 15vh auto;
    }
</style>
