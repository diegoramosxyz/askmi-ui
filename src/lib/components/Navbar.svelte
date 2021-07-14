<script>
  import { page } from '$app/stores'
  import { shrinkAddress } from '$lib/utils/ui'
  import { owner, signer } from '$lib/web3/store'
  import { connectToMetaMask } from '$lib/web3/MetaMask'
  import Adjustments from '$lib/svg/Adjustments.svelte'
  import { getBlockie } from '$lib/web3/tools'
  import QuestionMark from '$lib/svg/QuestionMark.svelte'
</script>

<nav class="mb-3 flex justify-between items-center py-3">
  <section>
    <a class="no-underline flex gap-2 items-center" href="/">
      <QuestionMark />
      <p>AskMi</p>
    </a>
  </section>
  <section class="flex items-center gap-4">
    {#if !!$owner && !!$signer && $owner.toLowerCase() === $signer.toLowerCase() && !$page.path.startsWith('/edit/')}
      <a
        class="no-underline flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
        href={`/edit/${$page.params.address}`}
      >
        <Adjustments />
        <p>Edit Contract</p></a
      >
    {/if}
    {#if $signer}
      <button
        class="flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
      >
        <img
          class="rounded h-6"
          src={getBlockie($signer)}
          alt="Blockie from questioner's address"
        />
        {shrinkAddress($signer)}</button
      >
    {:else}
      <button
        on:click={() => connectToMetaMask(signer)}
        class="flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
      >
        <img
          class="rounded h-6"
          src={getBlockie($signer)}
          alt="Blockie from questioner's address"
        />
        <p>MetaMask</p>
      </button>
    {/if}
  </section>
</nav>
