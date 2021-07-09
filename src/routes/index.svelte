<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpAskMiFactory } from '$lib/web3/tools'
  import Navbar from '$lib/components/Navbar.svelte'
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import {
    askMiFactory,
    factoryTiers,
    factoryTip,
    loading,
    myAskMi,
  } from '$lib/web3/store'
  import { utils } from 'ethers'
  import { goto } from '$app/navigation'

  onMount(async () => {
    let { VITE_ASKMI_FACTORY, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMiFactory(VITE_ASKMI_FACTORY, VITE_CHAIN_ID)
  })

  function instantiateAskMi() {
    let _tiers = $factoryTiers
      .filter(({ value }) => value > 0)
      .map(({ value }) => utils.parseEther(value.toString()))
    let _tip = utils.parseEther($factoryTip.toString())
    // Deploy an AskMi instance
    $askMiFactory.instantiateAskMi(_tiers, _tip)
    // Listen to the AskMiInstantiated event
    $askMiFactory.once('AskMiInstantiated', (_askMiAddress: string) => {
      // Redirect user to the newly create AskMi instance
      goto(`/instance/${_askMiAddress}`)
    })
  }
</script>

<main class="px-3 lg:px-0 max-w-screen-md mx-auto font-mono">
  <Navbar />
  {#if !$loading}
    {#if $myAskMi !== null}
      <a class="hover:underline" href={`/instance/${$myAskMi}`}
        >Go to your AskMi instance</a
      >
    {:else}
      <header>
        <h1 class="mb-3">Deploy an AskMi instance</h1>
      </header>
      <form on:submit|preventDefault={() => instantiateAskMi()}>
        <TierCards />
        <TipCard />
        <button class="px-2 py-1.5 bg-green-700 text-white rounded"
          >Deploy AskMi contract</button
        >
      </form>
    {/if}
  {:else}
    <p>Loading...</p>
  {/if}
</main>
