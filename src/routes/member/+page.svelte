<script>
    import Title from "../components/Title.svelte";

    const memberList = new Array(32);
</script>

<Title title="회원관리" />

<div class="contents">
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
                    <td class="name"></td>
                    <td class="count"></td>
                    <td class="avg"></td>
                    <td class="max"></td>
                    <td class="min"></td>
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
    }

    table {
        border-collapse: collapse;
    }

    thead {
        position: sticky;
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
