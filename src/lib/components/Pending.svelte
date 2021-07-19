<script>
  import ExternalLink from '$lib/svg/ExternalLink.svelte'
  import { pendingTx } from '$lib/web3/store'
</script>

{#if !!$pendingTx}
  <a
    class="text-center flex items-center gap-2"
    href={`https://ropsten.etherscan.io/tx/${$pendingTx}`}
    target="_blank"
    rel="noreferrer noopener">Pending Transaction <ExternalLink /></a
  >
{:else}
  <slot />
{/if}
