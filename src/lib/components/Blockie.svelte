<script lang="ts">
  import { getBlockie } from '$lib/web3/tools'
  import { shrinkAddress } from '$lib/utils/ui'

  export let address: string
</script>

<img
  class="rounded h-6"
  src={getBlockie(address)}
  alt="Ethereum address' graphical representation (Blockie)."
/>
<span class="font-mono pt-0.5">
  {shrinkAddress(address)}
</span>
