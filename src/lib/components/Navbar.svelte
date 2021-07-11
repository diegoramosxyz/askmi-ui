<script>
  import { page } from '$app/stores'
  import { shrinkAddress } from '$lib/utils/ui'
  import { owner, signer } from '$lib/web3/store'
  import { connectToMetaMask } from '$lib/web3/MetaMask'
</script>

<nav class="mb-3 flex justify-between items-center py-3">
  <section>
    <a href="/">AskMi</a>
  </section>
  <section>
    {#if $owner && $signer && $owner === $signer && !$page.path.startsWith('/edit/')}
      <a
        href={`/edit/${$page.params.address}`}
        class="px-3 py-2 ring-1 font-mono ring-amber-600 rounded"
        >Edit Your AskMi</a
      >
    {/if}
    {#if $signer}
      <button class="px-3 py-2 ring-1 font-mono ring-amber-600 rounded"
        >{shrinkAddress($signer)}</button
      >
    {:else}
      <button
        on:click={() => connectToMetaMask(signer)}
        class="px-3 py-2 ring-1 font-mono ring-trueGray-600 rounded"
        >MetaMask</button
      >
    {/if}
  </section>
</nav>
