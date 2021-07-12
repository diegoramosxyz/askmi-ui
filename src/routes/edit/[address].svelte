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
  import Link from '$lib/svg/Link.svelte'
  import Button from '$lib/components/Button.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)

    factoryTiers.set([
      {
        name: 'First',
        value: +$tiers[0],
      },
      {
        name: 'Second',
        value: +$tiers[1],
      },
      {
        name: 'Third',
        value: +$tiers[2],
      },
    ])

    factoryTip.set(+ethers.utils.formatEther($tip))
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
    <a
      class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
      href={`/instance/${$page.params.address}`}
      ><Link />
      <p>Go to your AskMi instance</p>
    </a>
    <header>
      <h1 class="my-4 text-center text-xl font-bold">
        Edit your AskMi instance
      </h1>
    </header>
    <form class="grid gap-3" on:submit|preventDefault={() => updateTiers()}>
      <TierCards />
      <Button color="green">Update Tiers</Button>
    </form>
    <form class="grid gap-3" on:submit|preventDefault={() => updateTip()}>
      <TipCard />
      <Button color="green">Update Tip</Button>
    </form>
  {:else}
    <p>Loading...</p>
  {/if}
</main>
