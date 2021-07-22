<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpAskMiFactory } from '$lib/web3/tools'
  import { askMiAddress } from '$lib/web3/store'
  import Link from '$lib/svg/Link.svelte'
  import InstantiateAskMi from '$lib/components/InstantiateAskMi.svelte'
  import Leaderboard from '$lib/components/Leaderboard.svelte'

  onMount(async () => {
    let { VITE_ASKMI_FACTORY, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMiFactory(VITE_ASKMI_FACTORY, VITE_CHAIN_ID)
  })
</script>

<svelte:head>
  <title>AskMi</title>
</svelte:head>

<div class="grid gap-5 sm:gap-0 sm:grid-cols-2 justify-center items-start">
  <!-- Check if the current signer alreadt has an AskMi contract -->
  {#if $askMiAddress === null}
    <div class="grid justify-center">
      <InstantiateAskMi />
    </div>
  {:else}
    <a
      class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
      href={`/instance/${$askMiAddress}`}
      ><Link />
      <p>Go to your AskMi instance</p>
    </a>
  {/if}
  <Leaderboard />
</div>
