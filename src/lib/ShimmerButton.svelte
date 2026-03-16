<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		shimmerColor?: string;
		shimmerSize?: string;
		borderRadius?: string;
		shimmerDuration?: string;
		background?: string;
		children?: Snippet;
	}

	let {
		shimmerColor = '#ffffff',
		shimmerSize = '0.05em',
		shimmerDuration = '3s',
		borderRadius = '100px',
		background = 'rgba(0, 0, 0, 1)',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<button
	style="
		--spread: 90deg;
		--shimmer-color: {shimmerColor};
		--radius: {borderRadius};
		--speed: {shimmerDuration};
		--cut: {shimmerSize};
		--bg: {background};
	"
	class="shimmer-button group {className}"
	{...rest}
>
	<!-- spark container -->
	<div class="spark-container">
		<!-- spark -->
		<div class="spark">
			<!-- spark gradient -->
			<div class="spark-gradient"></div>
		</div>
	</div>

	{#if children}
		{@render children()}
	{/if}

	<!-- highlight -->
	<div class="shimmer-highlight"></div>

	<!-- backdrop -->
	<div class="shimmer-backdrop"></div>
</button>

<style>
	.shimmer-button {
		position: relative;
		z-index: 0;
		display: inline-flex;
		cursor: pointer;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: var(--radius);
		border: 1px solid rgba(255, 255, 255, 0.1);
		padding: 0.75rem 1.5rem;
		white-space: nowrap;
		color: white;
		background: var(--bg);
		transform: translateZ(0);
		transition: transform 300ms ease-in-out;
	}

	.shimmer-button:active {
		transform: translateY(1px);
	}

	.spark-container {
		position: absolute;
		inset: 0;
		z-index: -30;
		overflow: visible;
		filter: blur(2px);
		container-type: size;
	}

	.spark {
		position: absolute;
		inset: 0;
		aspect-ratio: 1;
		height: 100cqh;
		border-radius: 0;
		mask: none;
		animation: shimmer-slide var(--speed) ease-in-out infinite;
	}

	.spark-gradient {
		position: absolute;
		inset: -100%;
		width: auto;
		rotate: 0deg;
		translate: 0 0;
		background: conic-gradient(
			from calc(270deg - (var(--spread) * 0.5)),
			transparent 0,
			var(--shimmer-color) var(--spread),
			transparent var(--spread)
		);
		animation: spin-around calc(var(--speed) * 2) linear infinite;
	}

	.shimmer-highlight {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 1rem;
		padding: 0.375rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		box-shadow: inset 0 -8px 10px rgba(255, 255, 255, 0.12);
		transform: translateZ(0);
		transition: all 300ms ease-in-out;
		pointer-events: none;
	}

	.shimmer-button:hover .shimmer-highlight {
		box-shadow: inset 0 -6px 10px rgba(255, 255, 255, 0.25);
	}

	.shimmer-button:active .shimmer-highlight {
		box-shadow: inset 0 -10px 10px rgba(255, 255, 255, 0.25);
	}

	.shimmer-backdrop {
		position: absolute;
		inset: var(--cut);
		z-index: -20;
		border-radius: var(--radius);
		background: var(--bg);
		pointer-events: none;
	}

	@keyframes shimmer-slide {
		to {
			transform: translateX(100%);
		}
	}

	@keyframes spin-around {
		to {
			rotate: 360deg;
		}
	}
</style>
