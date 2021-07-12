<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { ask, setUpAskMi } from '$lib/web3/tools'
  import {
    signer,
    owner,
    tiers,
    loading,
    textAreaContent,
  } from '$lib/web3/store'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import Navbar from '$lib/components/Navbar.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)
  })

  let index: number
</script>

<main class="max-w-screen-md mx-auto">
  {#if $loading === false}
    <Navbar />
    {#if $owner && $signer && $owner.toLowerCase() !== $signer.toLowerCase()}
      <form
        class="mb-5 grid justify-center"
        on:submit|preventDefault={async () => await ask(index)}
      >
        <textarea
          bind:value={$textAreaContent}
          cols="40"
          rows="7"
          class="mb-3 px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
          placeholder="Ask a question here."
        />
        <section class="flex gap-4 mb-2 items-center">
          <h1 class="font-bold text-lg">Tier</h1>
          {#each $tiers as tier, i}
            <article class="flex gap-2 items-center">
              <input
                type="radio"
                id={tier}
                name="tier"
                bind:group={index}
                value={i}
              />
              <label for={tier}>{tier} ETH</label>
            </article>
          {/each}
        </section>
        <div>
          <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
            >ASK</button
          >
        </div>
      </form>
    {/if}
    <Exchanges />
  {/if}
</main>
