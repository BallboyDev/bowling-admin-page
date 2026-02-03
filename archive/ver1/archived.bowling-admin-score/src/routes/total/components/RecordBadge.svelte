<script>
    // @ts-nocheck

    import { onMount } from "svelte";

    // props, state value
    let items = $state([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7]);

    onMount(() => {});

    const handle = {};
    const callApi = {};
</script>

{#snippet Badge(i)}
    <div
        class="badgeItem d-flex justify-content-center align-items-center rounded-circle m-2"
    >
        {i}
    </div>
{/snippet}

<div id="records" class="p-2 rounded-4 d-flex justify-content-center">
    <div class="badges w-100 d-flex flex-wrap justify-content-around">
        {#each items as item, i}
            {@render Badge(item)}
        {/each}
    </div>
</div>

<style lang="scss">
    #records {
        background-color: #282828;
        border: 1px solid gray;

        & > .badges {
            & > .badgeItem {
                width: 5rem;
                height: 5rem;
                border: 1px solid gray;
            }
        }
    }
</style>
