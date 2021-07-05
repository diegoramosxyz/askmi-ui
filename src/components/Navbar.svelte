<script>
  import { shrinkAddress } from '../utils/ui'

  import { signer } from '../web3/store'
</script>

<nav class="flex justify-between items-center py-3">
  <section>dQandA</section>
  {#if $signer}
    <button class={`px-3 py-2 ring-1 font-mono ring-amber-600 rounded`}
      >{shrinkAddress($signer.address)}</button
    >
  {:else}
    <button class={`px-3 py-2 ring-1 font-mono ring-trueGray-600 rounded`}
      >MetaMask</button
    >
  {/if}
</nav>
