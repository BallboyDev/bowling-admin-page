<script>
    import Title from "../components/Title.svelte";
    import records from "./records.json";
</script>

<Title title="점수 관리 - 양승우" />

<div class="contents">
    <div class="type">
        <input type="checkbox" /><label for="">정기전</label>
        <input type="checkbox" /><label for="">번개</label>
    </div>

    <table>
        <thead>
            <tr>
                <th>번호</th>
                <th>날짜</th>
                <th>타입</th>
                <th>게임수</th>
                <th>총점</th>
                <th>평균</th>
                <th>점수</th>
            </tr>
        </thead>
        <tbody>
            {#each records as record, i}
                <tr>
                    <td class="index">{i + 1}</td>
                    <td class="date">{record.date}</td>
                    <td class="type">{record.type}</td>
                    <td class="count">{record.scores.length}</td>
                    <td class="total">{record.total}</td>
                    <td class="avg">{record.avg}</td>
                    {#each record.scores as score}
                        <td class="score">{score}</td>
                    {/each}
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

        & > table {
            border-collapse: collapse;

            & > thead {
                position: sticky;
                & > tr > th {
                    padding: 0.5rem 0;
                }
            }

            & td {
                height: 3rem;
                border: 1px solid white;
                text-align: center;
            }

            & .index {
                width: 2rem;
            }
            & .date {
                width: 8rem;
            }
            & .type {
                width: 6rem;
            }
            & .count {
                width: 3rem;
            }
            & .total {
                width: 6rem;
            }
            & .avg {
                width: 6rem;
            }
            & .score {
                width: 6rem;
                border: 1px solid rgb(28, 30, 65);
                background-color: rgb(38, 41, 86);
            }
        }
    }
</style>
