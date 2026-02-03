<script lang="ts">
    const { pageTitle = "페이지 타이틀", children = null } = $props();
</script>

<div class="d-flex w-100 align-items-center justify-content-between">
    <h1 class="my-3">{pageTitle}</h1>
    {#if !!children}
        <div>
            {@render children?.()}
        </div>
    {/if}
</div>
