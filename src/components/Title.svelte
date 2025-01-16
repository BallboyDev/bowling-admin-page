<script>
    // @ts-nocheck

    import { setMember } from "../lib/store/store";

    const { title } = $props();
    let member = $state({});

    setMember.subscribe((value) => {
        member = value;
    });
</script>

<div class="title">
    {#if !!member.name}
        <h1>{title} - {member?.name}</h1>
    {:else}
        <h1>{title}</h1>
    {/if}
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
