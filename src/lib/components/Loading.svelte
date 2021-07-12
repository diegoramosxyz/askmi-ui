<script>
  import { loading } from '$lib/web3/store'
</script>

<!-- Use a grid avoid layout shift during transition -->
<div class="grid justify-center">
  {#if $loading === true}
    <p class="col-start-1 row-start-1">Loading...</p>
  {/if}
  {#if $loading === false}
    <slot />
  {/if}
</div>
