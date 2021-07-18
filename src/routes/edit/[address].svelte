<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi, updateTiers, updateTip } from '$lib/web3/tools'
  import { ethers } from 'ethers'
  import {
    factoryTiers,
    factoryTip,
    tiers,
    tiersUpdated,
    tip,
    tipUpdated,
  } from '$lib/web3/store'
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import Link from '$lib/svg/Link.svelte'
  import Button from '$lib/components/Button.svelte'
  import Cog from '$lib/svg/Cog.svelte'
  import Loading from '$lib/components/Loading.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)

    factoryTiers.set([
      {
        name: 'Slow',
        value: +$tiers[0],
      },
      {
        name: 'Medium',
        value: +$tiers[1],
      },
      {
        name: 'Fast',
        value: +$tiers[2],
      },
    ])

    factoryTip.set(+ethers.utils.formatEther($tip))
    tiersUpdated.set(false)
    tipUpdated.set(false)
  })
</script>

<Loading>
  <a
    class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
    href={`/instance/${$page.params.address}`}
    ><Link />
    <p>Go to your AskMi instance</p>
  </a>
  <header>
    <h1 class="my-4 text-center text-xl font-bold">Edit your AskMi instance</h1>
  </header>
  <div class="grid gap-5 justify-center">
    <form
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
      on:submit|preventDefault={() => updateTiers()}
    >
      {#if $tiersUpdated === true}
        <p
          class="px-2 py-0.5 rounded font-bold bg-trueGray-300 text-trueGray-900"
        >
          Tiers will update soon!
        </p>
      {/if}
      <TierCards />
      <Button color="lime"><Cog />Update Tiers</Button>
    </form>
    <form
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
      on:submit|preventDefault={() => updateTip()}
    >
      {#if $tipUpdated === true}
        <p
          class="px-2 py-0.5 rounded font-bold bg-trueGray-300 text-trueGray-900"
        >
          The tip cost will update soon!
        </p>
      {/if}
      <TipCard />
      <Button color="lime"><Cog />Update Tip</Button>
    </form>
  </div>
</Loading>
