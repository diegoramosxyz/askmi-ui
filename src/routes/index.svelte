<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpWeb3 } from '$lib/web3/tools'
  import Navbar from '$lib/components/Navbar.svelte'

  onMount(async () => {
    let { VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpWeb3(VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID, $page.path)
  })

  let basicTier: string
  let mediumTier: string
  let premiumTier: string
  let tipPrice: string
</script>

<main class="max-w-screen-md mx-auto">
  <Navbar />
  <h1 class="mb-3">Deploy an AskMi instance</h1>
  <h2>Tiers in ETH</h2>
  <section class="grid gap-2">
    <label for="basic">Basic</label>
    <input
      class="px-2 py-1 bg-black text-white rounded"
      type="number"
      name="basic"
      bind:value={basicTier}
    />
    <label for="medium">Medium</label>
    <input
      class="px-2 py-1 bg-black text-white rounded"
      type="number"
      name="medium"
      bind:value={mediumTier}
    />
    <label for="premium">Premium</label>
    <input
      class="px-2 py-1 bg-black text-white rounded"
      type="number"
      name="premium"
      bind:value={premiumTier}
    />
  </section>
  <h2>Tip price in ETH</h2>
  <section class="grid gap-2">
    <label for="basic">Tip price</label>
    <input
      class="px-2 py-1 bg-black text-white rounded"
      type="number"
      name="tip"
      bind:value={tipPrice}
    />
  </section>
  <button
    class="px-2 py-1.5 bg-green-700 text-white rounded"
    on:click={() => console.log('Implement contract deploy')}
    >Deploy AskMi contract</button
  >
</main>
