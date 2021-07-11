<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import { ethers, utils } from 'ethers'
  import {
    askMi,
    loading,
    factoryTiers,
    factoryTip,
    tiers,
    tip,
  } from '$lib/web3/store'
  import Navbar from '$lib/components/Navbar.svelte'
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)
  })

  function updateTiers() {
    let _tiers = $factoryTiers
      .filter(({ value }) => value > 0)
      .map(({ value }) => utils.parseEther(value.toString()))
    $askMi.updateTiers(_tiers)
    $askMi.once('TiersUpdated', (_askMiAddress: string) => {
      console.log('Tiers Updated.')
      location.reload()
    })
  }

  function updateTip() {
    let _tip = utils.parseEther($factoryTip.toString())
    $askMi.updateTip(_tip)
    $askMi.once('TipUpdated', (_askMiAddress: string) => {
      console.log('Tip Updated.')
      location.reload()
    })
  }
</script>

<main class="max-w-screen-md mx-auto">
  <Navbar />
  {#if !$loading}
    <a class="hover:underline" href={`/instance/${$page.params.address}`}
      >Go to your AskMi instance</a
    >
    <header>
      <h1 class="mb-3">Edit your AskMi instance</h1>
    </header>
    {#each $tiers as tier, i}
      <article class="flex gap-2 items-center">
        <p>tier {i + 1}: {tier} ETH</p>
      </article>
    {/each}
    <p>Tip: {ethers.utils.formatEther($tip)} ETH</p>
    <form on:submit|preventDefault={() => updateTiers()}>
      <TierCards />
      <button class="px-2 py-1.5 bg-green-700 text-white rounded"
        >Update Tiers</button
      >
    </form>
    <form on:submit|preventDefault={() => updateTip()}>
      <TipCard />
      <button class="px-2 py-1.5 bg-green-700 text-white rounded"
        >Update Tip</button
      >
    </form>
  {:else}
    <p>Loading...</p>
  {/if}
</main>
