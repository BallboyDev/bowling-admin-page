<script>
    // @ts-nocheck

    import axios from "axios";
    import Title from "../../components/Title.svelte";
    import { onMount } from "svelte";

    let name = $state("");
    let birth = $state("");
    let phone = $state("");
    let memberList = $state([]);

    onMount(() => {
        getMemberList();
    });

    const submit = async () => {
        if (!!name && !!birth && !!phone) {
            console.log("callApi");

            await axios
                .post("http://localhost:3000/bap/admin/createMember", {
                    name,
                    birth,
                    phone,
                })
                .then((res) => {
                    name = "";
                    birth = "";
                    phone = "";
                })
                .finally(() => {
                    getMemberList();
                });
        } else {
            alert("check value!!!");
        }
    };

    const getMemberList = async () => {
        await axios
            .get("http://localhost:3000/bap/admin/memberList")
            .then((res) => {
                console.log(res.data);
                memberList = res.data;
            });
    };
</script>

<Title title="관리자 페이지" />

<div class="contents">
    <div class="type">
        <label class="label" for="">이름</label>
        <input class="data" type="text" name="name" bind:value={name} />
        <br />

        <label class="label" for="">생일</label>
        <input class="data" type="date" name="birth" bind:value={birth} />
        <br />

        <label class="label" for="">전화번호</label>
        <input class="data" type="tel" name="phone" bind:value={phone} />
    </div>

    <button onclick={submit}>submit</button>

    <div class="members">
        {#each memberList as member}
            <div>{member.name}</div>
        {/each}
    </div>
</div>

<style lang="scss">
    .contents {
        padding: 1rem;

        & > .type {
            & > .label {
                margin-right: 0.5rem;
                width: 5rem;
                display: inline-block;
            }
            & > .data {
                margin-right: 1rem;
                width: 10rem;
                display: inline-block;
            }

            & > .submit {
                width: 5rem;
                height: 2rem;
                display: inline-block;
            }
        }

        & > .members {
            padding: 1rem 0;
        }
    }
</style>
