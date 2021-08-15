<script>
  import { web3Store } from '$lib/stores/web3'

  import ExternalLink from '$lib/svg/ExternalLink.svelte'
</script>

{#if !!$web3Store['pendingTx']}
  <div
    class="absolute z-10 top-5 right-5 px-3 py-2 rounded ring-1 ring-trueGray-100 bg-trueGray-900"
  >
    <a
      class="text-center flex items-center gap-2"
      href="https://ropsten.etherscan.io/tx/{$web3Store['pendingTx']}"
      target="_blank"
      rel="noreferrer noopener">Pending Transaction <ExternalLink /></a
    >
  </div>
{/if}
