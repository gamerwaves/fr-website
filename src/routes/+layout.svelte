<script lang="ts">
	import '../app.css';
	import '../styles/fonts.css';
	import '../app.css';
	import CustomCursor from '$lib/CustomCursor.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="shortcut icon" href="favicon.png" type="image/x-icon">
</svelte:head>

{@render children()}


<CustomCursor />