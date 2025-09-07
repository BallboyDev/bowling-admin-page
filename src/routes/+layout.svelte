<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="wrapper">
	{@render children?.()}
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:global(html, body) {
		width: 100%;
		height: 100%;
	}

	.wrapper {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		height: 100%;
	}
</style>
