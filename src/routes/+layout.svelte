<script lang="ts">
	import '../app.css';

	let { children, data } = $props();

	import AtmNavbar from '$lib/AtmNavbar.svelte';
</script>

{#if data.user}
	<AtmNavbar />
{/if}

<div class="w-full">
	<div class="mx-auto container items-center justify-between">
		{@render children()}
	</div>
</div>
