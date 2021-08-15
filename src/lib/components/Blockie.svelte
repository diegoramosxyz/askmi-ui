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
