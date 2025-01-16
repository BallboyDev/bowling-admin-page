<script>
    // @ts-nocheck

    import axios from "axios";
    import Title from "../../components/Title.svelte";
    // import records from "./records.json";
    import { PUBLIC_API_URL } from "$env/static/public";
    import { onMount } from "svelte";
    import dayjs from "dayjs";
    import { setMember } from "../../lib/store/store";

    // const id = 1;
    let records = $state([]);
    let member = $state({});

    onMount(() => {
        scoreList();
    });

    setMember.subscribe((value) => {
        member = value;
    });

    const scoreList = async () => {
        await axios
            .get(`${PUBLIC_API_URL}/bap/scoreRecord/${member.userId}`)
            .then((res) => {
                console.log(res.data);
                records = res.data;
            });
    };
</script>

<Title title="점수 관리" />

<div class="contents">
    <div class="type">
        <input type="checkbox" /><label for="">정기전</label>
        <input type="checkbox" /><label for="">번개</label>
    </div>

    <div class="wrapper">
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
                        <!-- <td class="date">{record.date}</td> -->
                        <td class="date"
                            >{dayjs(record.date).format("YYYY-MM-DD")}</td
                        >
                        <td class="type">{record.type}</td>
                        <td class="count">{record.count}</td>
                        <td class="total">{record.total}</td>
                        <td class="avg">{record.avg}</td>
                        {#each record.scores.split(",") as score}
                            <td class="score">{score}</td>
                        {/each}
                    </tr>
                {/each}
                <!-- <tr>
                    <td class="index"></td>
                    <td class="date"></td>
                    <td class="type"></td>
                    <td class="count"></td>
                    <td class="total"></td>
                    <td class="avg"></td>
                </tr> -->
            </tbody>
        </table>
    </div>
</div>

<style lang="scss">
    .contents {
        padding: 0 1rem;
        margin: 1rem 0;

        & > .type {
            & > input {
                margin-right: 0.5rem;
            }
            & > label {
                margin-right: 1rem;
            }
        }

        & > .wrapper {
            width: 100%;
            overflow: scroll;
            & > table {
                border-collapse: collapse;
                overflow: scroll;

                & > thead {
                    // position: sticky;
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
                    // position: sticky;
                    width: 2rem;
                    min-width: 2rem;
                }
                & .date {
                    width: 8rem;
                    min-width: 8rem;
                }
                & .type {
                    width: 6rem;
                    min-width: 6rem;
                }
                & .count {
                    width: 3rem;
                    min-width: 3rem;
                }
                & .total {
                    width: 6rem;
                    min-width: 6rem;
                }
                & .avg {
                    width: 6rem;
                    min-width: 6rem;
                }
                & .score {
                    width: 6rem;
                    min-width: 6rem;

                    border: 1px solid rgb(28, 30, 65);
                    background-color: rgb(38, 41, 86);
                }
            }
        }
    }
</style>
