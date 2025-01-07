<script>
    const { title } = $props();
</script>

<div class="title">
    <h1>{title} - 1월</h1>
</div>

<hr />

<style>
    .title {
        margin: 1rem;
        display: flex;
        align-items: end;

        & > h1 {
            margin-right: 1rem;
        }
    }
</style>
