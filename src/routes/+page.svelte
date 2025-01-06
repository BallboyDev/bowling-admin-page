<script>
    const member = ["member1", "member2", "member3"];
    const days = new Array(31);
</script>

<h1 class="month">1월</h1>
<hr />

<div class="wrapper">
    <div class="names">
        {#each member as name}
            <div class="data-item">{name}</div>
        {/each}
    </div>

    <table
        class="scores"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
    >
        <tbody>
            {#each member as name}
                <tr>
                    {#each days as day, i}
                        <td class="data-item">{i + 1}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .month {
        padding: 1rem;
    }

    .wrapper {
        width: 100%;
        display: flex;

        & > .names {
            width: 5rem;
            & > div {
                width: 5rem;
            }
        }

        & > .scores {
            width: 100%;

            & > tr {
                overflow: scroll;
            }
        }
    }

    .data-item {
        width: 3rem;
        height: 3rem;
    }
</style>
