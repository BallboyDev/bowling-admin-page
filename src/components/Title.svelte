<script>
    const { title } = $props();
</script>

<div class="title">
    <h1>{title} - 1월</h1>
    <a href="/">home</a>
</div>

<hr />

<style>
    .title {
        margin: 1rem;
        display: flex;
        align-items: end;
        justify-content: space-between;

        & > h1 {
            margin-right: 1rem;
        }

        & > a {
            text-decoration: none;
            color: #cccccc;
        }
    }
</style>
