<script>
    // @ts-nocheck

    import { onMount } from "svelte";
    import Title from "../../components/Title.svelte";
    import { PUBLIC_API_URL } from "$env/static/public";
    import axios from "axios";
    import { setMember } from "../../lib/store/store";

    let memberList = $state([]);

    onMount(() => {
        axios.get(`${PUBLIC_API_URL}/bap`).then((res) => {
            memberList = res.data;
        });
    });
</script>

<Title title="회원관리" />

<div class="contents">
    <div class="type">
        <input type="checkbox" /><label for="">정기전</label>
        <input type="checkbox" /><label for="">번개</label>
    </div>

    <table>
        <thead>
            <tr>
                <th>번호</th>
                <th>이름</th>
                <th>게임수</th>
                <th>평균</th>
                <th>최대</th>
                <th>최소</th>
                <th>회비</th>
            </tr>
        </thead>
        <tbody>
            {#each memberList as member, i}
                <tr>
                    <td class="index">{i + 1}</td>
                    <td
                        class="name"
                        onclick={() => {
                            setMember.set(member);
                        }}
                    >
                        <a href="/score">{member.name}</a>
                    </td>
                    <td class="count">{member.count}</td>
                    <td class="avg">{member.avg}</td>
                    <td class="max">{member.max}</td>
                    <td class="min">{member.min}</td>
                    <td class="dues">
                        <button>회비</button>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .contents {
        padding: 1rem;

        & > .type {
            & > input {
                margin-right: 0.5rem;
            }
            & > label {
                margin-right: 1rem;
            }
        }
    }

    table {
        border-collapse: collapse;
    }

    thead {
        position: sticky;
        & > tr > th {
            padding: 0.5rem 0;
        }
    }

    td {
        height: 3rem;
        border: 1px solid white;
        text-align: center;
        line-height: 3rem;
    }

    .index {
        width: 3rem;
    }
    .name {
        width: 9rem;
        & > a {
            text-decoration: none;
            color: #cccccc;

            &:hover {
                color: #888888;
            }
        }
    }
    .count {
        width: 4rem;
    }
    .avg {
        width: 6rem;
    }
    .max {
        width: 6rem;
    }
    .min {
        width: 6rem;
    }
    .dues {
        width: 4rem;

        & > button {
            width: 75%;
            height: 50%;
        }
    }
</style>
