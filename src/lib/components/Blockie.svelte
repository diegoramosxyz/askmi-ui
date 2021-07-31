<script lang="ts">
  import { getBlockie, shrinkAddress } from '$lib/utils/ui'

  export let address: string
</script>

<div class="flex gap-2 items-center">
  <img
    class="rounded h-6"
    src={getBlockie(address)}
    alt="Ethereum address' graphical representation (Blockie)."
  />
  <span class="font-mono pt-0.5">
    {shrinkAddress(address)}
  </span>
</div>

<!-- {#if !!$provider}
  {#await $provider.lookupAddress('0x5555763613a12D8F3e73be831DFf8598089d3dCa')}
    <p>...waiting</p>
  {:then ens}
    <h1 class="text-lg font-semibold">{ens}</h1>
  {:catch}
    <p class="text-red-600 font-mono">Data unavailable</p>
  {/await}
{/if} -->
