<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { ask, setUpAskMi } from '$lib/web3/tools'
  import {
    owner,
    tiers,
    loading,
    textAreaContent,
    signer,
  } from '$lib/web3/store'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import makeBlockie from 'ethereum-blockies-base64'
  import { shrinkAddress } from '$lib/utils/ui'
  import Button from '$lib/components/Button.svelte'
  import Plus from '$lib/svg/Plus.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)
  })

  let index: number
</script>

{#if $loading === false}
  <Navbar />
  {#if !!$owner && !!$signer && $owner.toLowerCase() !== $signer.toLowerCase()}
    <form
      class="mb-5 grid justify-center"
      on:submit|preventDefault={async () => await ask(index)}
    >
      <p class="mb-2 p-1.5 flex gap-2 items-center">
        Ask
        <img
          class="rounded h-6"
          src={makeBlockie($owner)}
          alt="Blockie from questioner's address"
        />
        <span class="font-mono px-2 py-1 rounded ring-1 ring-trueGray-700"
          >{shrinkAddress($owner)}</span
        >
        a question:
      </p>
      <textarea
        bind:value={$textAreaContent}
        cols="40"
        rows="4"
        class="mb-3 px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
        placeholder="Type here..."
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
        <Button color="lightBlue"><Plus /> Ask</Button>
      </div>
    </form>
  {/if}
  <Exchanges />
{/if}
