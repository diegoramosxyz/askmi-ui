<script>
  import { page } from '$app/stores'
  import { getBlockie, shrinkAddress } from '$lib/utils/ui'
  import { connectToMetaMask } from '$lib/web3/MetaMask'
  import Adjustments from '$lib/svg/Adjustments.svelte'
  import QuestionMark from '$lib/svg/QuestionMark.svelte'
  import Search from './Search.svelte'
  import { askMiStore, web3Store } from '$lib/web3/store'

  let { isOwnerCheck } = askMiStore

  $: isOwner = isOwnerCheck($web3Store.signer, $askMiStore._owner)
</script>

<nav class="mb-3 flex justify-between items-center py-3">
  <section>
    <a class="hidden md:flex no-underline gap-2 items-center" href="/">
      <QuestionMark />
      <p>AskMi</p>
    </a>
  </section>
  <section class="flex flex-row-reverse sm:flex-row gap-2 sm:gap-4">
    {#if isOwner && !$page.path.startsWith('/edit/')}
      <a
        class="no-underline flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
        href={`/edit/${$page.params.address}`}
      >
        <Adjustments />
        <p class="hidden sm:block">Edit Contract</p></a
      >
    {/if}
    {#if $web3Store.signer}
      <button
        class="hidden sm:flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
      >
        <img
          class="rounded h-6"
          src={getBlockie($web3Store.signer)}
          alt="Blockie from questioner's address"
        />
        {shrinkAddress($web3Store.signer)}</button
      >
    {:else}
      <button
        on:click={() => connectToMetaMask()}
        class="flex items-center gap-2 px-3 py-1.5 ring-1 ring-trueGray-700 rounded"
      >
        <p>MetaMask</p>
      </button>
    {/if}
    {#if !!$page && $page.path === '/'}
      <Search />
    {/if}
  </section>
</nav>
