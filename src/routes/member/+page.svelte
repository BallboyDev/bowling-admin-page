<script lang="ts">
    let score1 = $state(0);
    let score2 = $state(0);
    let score3 = $state(0);
    let score4 = $state(0);
</script>

<h1>사용자 페이지</h1>

<div class="content">
    <table>
        <colgroup>
            <col style="width: 20%" />
            <col style="width: 40%" />
            <col style="width: 30%" />
        </colgroup>
        <tbody>
            <tr>
                <td>Game</td>
                <td>Input</td>
                <td>사이드</td>
            </tr>
            <tr>
                <td>Game 1</td>
                <td>
                    <input type="number" bind:value={score1} />
                </td>
                <td>
                    <input type="checkbox" />
                </td>
            </tr>
            <tr>
                <td>Game 2</td>
                <td>
                    <input type="number" bind:value={score2} />
                </td>
                <td>
                    <input type="checkbox" />
                </td>
            </tr>
            <tr>
                <td>Game 3</td>
                <td>
                    <input type="number" bind:value={score3} />
                </td>
                <td>
                    <input type="checkbox" />
                </td>
            </tr>
            <tr>
                <td>Game 4</td>
                <td>
                    <input type="number" bind:value={score4} />
                </td>
                <td>
                    <input type="checkbox" />
                </td>
            </tr>
        </tbody>
    </table>
</div>

<style lang="scss">
    .content {
        & input:not([type="checkbox"], [name="registName"]) {
            width: 100%;
            height: 100%;
            border: 0;
            padding: 0 0.5rem;
        }
    }

    table,
    tr,
    td {
        border-collapse: collapse;
        border: 1px solid black;
        text-align: center;
        position: relative;
    }

    table {
        width: 100%;
    }

    td,
    td > * {
        height: 1.2rem;
        text-align: center;
        font-size: 1rem;
    }
</style>
