<script>
  import ExternalLink from '$lib/svg/ExternalLink.svelte'
  import { web3Store } from '$lib/web3/store'
</script>

{#if !!$web3Store['pendingTx']}
  <a
    class="text-center flex items-center gap-2"
    href={`https://ropsten.etherscan.io/tx/${$web3Store['pendingTx']}`}
    target="_blank"
    rel="noreferrer noopener">Pending Transaction <ExternalLink /></a
  >
{:else}
  <slot />
{/if}
