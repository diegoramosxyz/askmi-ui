<script>
  import { loading } from '$lib/stores/other'
</script>

<!-- Use a grid avoid layout shift during transition -->
{#if $loading === true}
  <p class="col-start-1 row-start-1">Loading...</p>
{/if}
{#if $loading === false}
  <slot />
{/if}
