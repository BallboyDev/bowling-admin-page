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

    <div class="scores">
        {#each days as day, i}
            <div>
                <div>{i + 1}</div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        {/each}
        <!-- 012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789 -->
    </div>
</div>

<style lang="scss">
    .month {
        padding: 1rem;
    }

    .wrapper {
        margin: 1rem 0;
        width: 100%;
        display: flex;

        & > .names {
            width: 5rem;
            & > div {
                width: 5rem;
            }
        }

        & > .scores {
            border: 1px solid white;
            width: 100%;

            display: flex;
            flex-wrap: no-wrap;
            overflow: scroll;

            & > div {
                flex: 0 0 auto;
                & > div {
                    width: 3rem;
                    height: 3rem;
                    border: 1px solid white;
                }
            }
        }
    }

    .data-item {
        height: 3rem;
    }
</style>
