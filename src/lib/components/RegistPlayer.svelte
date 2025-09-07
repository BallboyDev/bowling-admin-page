<script lang="ts">
    import { enhance } from "$app/forms";
    import { onMount } from "svelte";

    let { players, date } = $props();

    const handle = {
        regist: () => {},
    };
</script>

<div class="regist-player">
    <h3>참석자 등록 ({players.length})</h3>

    <form method="post" use:enhance>
        <input type="text" name="registName" />
        <button type="submit" formaction={`?/regist&date=${date}`}>등록</button>
    </form>

    <form method="post" use:enhance>
        <table>
            <colgroup>
                <col style="width: 25%" />
                <col style="width: 25%" />
                <col style="width: 25%" />
                <col style="width: 25%" />
            </colgroup>
            <thead>
                <tr>
                    <th>이름</th>
                    <th>핸디</th>
                    <th>게스트</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {#each players as player}
                    <tr>
                        <td class={player.team ? "up" : "down"}>
                            {player.name}
                        </td>
                        <td>{player.handicap}</td>
                        <td>
                            {player.guest ? "Guest" : ""}
                        </td>
                        <td>
                            <button
                                type="submit"
                                formaction={`?/teamChange&id=${player._id}&team=${player.team}`}
                            >
                                팀변경
                            </button>
                            <button
                                type="submit"
                                formaction={`?/delete&id=${player._id}`}
                            >
                                삭제
                            </button>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </form>
</div>

<style lang="scss">
    .regist-player {
        width: 25rem;
        height: 100%;
        border: 1px solid black;
        border-radius: 0.5rem;
        padding: 1rem;
        margin-right: 1rem;

        & > h3 {
            margin-bottom: 0.5rem;
        }

        & input:not([type="checkbox"], [name="registName"]) {
            width: 100%;
            height: 100%;
            border: 0;
        }

        & input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        & > form {
            margin-bottom: 0.5rem;
        }

        & .up {
            background-color: skyblue;
        }
        & .down {
            background-color: pink;
        }
    }

    table,
    tr,
    th,
    td {
        border-collapse: collapse;
        border: 1px solid black;
        text-align: center;
        position: relative;
    }

    table {
        width: 100%;
    }

    thead,
    tbody {
        margin-bottom: 0.5rem;
    }

    td,
    td > * {
        height: 1.2rem;
        text-align: center;
    }
</style>
