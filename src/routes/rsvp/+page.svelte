<script lang="ts">
  let { data } = $props();
</script>

<svelte:head>
  <title>Redirecting...</title>
</svelte:head>

<div class="page">
  <section class="hero">
    <h1>Redirecting...</h1>
    {#if data?.error}
      <p>{data.error}</p>
    {:else}
      <p>Sending you to the RSVP form.</p>
    {/if}
  </section>
</div>
