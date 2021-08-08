<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpAskMiFactory } from '$lib/web3/tools'
  import Link from '$lib/svg/Link.svelte'
  import InstantiateAskMi from '$lib/components/InstantiateAskMi.svelte'
  import Leaderboard from '$lib/components/Leaderboard.svelte'
  import { askMiStore } from '$lib/web3/store'

  onMount(async () => {
    let {
      VITE_ROPSTEN_CHAIN_ID,
      VITE_ROPSTEN_ASKMI_FACTORY,
      VITE_ROPSTEN_ASKMI_FUNCTIONS,
      VITE_ROPSTEN_ERC20,
      VITE_MUMBAI_CHAIN_ID,
      VITE_MUMBAI_ASKMI_FACTORY,
      VITE_MUMBAI_ASKMI_FUNCTIONS,
      VITE_MUMBAI_ERC20,
      VITE_LOCALHOST_CHAIN_ID,
      VITE_LOCALHOST_ASKMI_FACTORY,
      VITE_LOCALHOST_ASKMI_FUNCTIONS,
      VITE_LOCALHOST_ERC20,
    } = import.meta.env

    const _chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (_chainId === '0x3') {
      // Set up event listeners and load stores with initial data
      await setUpAskMiFactory(
        VITE_ROPSTEN_ASKMI_FACTORY,
        VITE_ROPSTEN_ASKMI_FUNCTIONS,
        VITE_ROPSTEN_CHAIN_ID,
        VITE_ROPSTEN_ERC20
      )
    }
    if (_chainId === '0x13881') {
      await setUpAskMiFactory(
        VITE_MUMBAI_ASKMI_FACTORY,
        VITE_MUMBAI_ASKMI_FUNCTIONS,
        VITE_MUMBAI_CHAIN_ID,
        VITE_MUMBAI_ERC20
      )
    }
    if (_chainId === '0x7a69') {
      await setUpAskMiFactory(
        VITE_LOCALHOST_ASKMI_FACTORY,
        VITE_LOCALHOST_ASKMI_FUNCTIONS,
        VITE_LOCALHOST_CHAIN_ID,
        VITE_LOCALHOST_ERC20
      )
    }
  })
</script>

<svelte:head>
  <title>AskMi</title>
</svelte:head>

<div class="grid gap-5 sm:gap-0 sm:grid-cols-2 justify-center items-start">
  <!-- Check if the current signer alreadt has an AskMi contract -->
  {#if !$askMiStore['address']}
    <div class="grid justify-center">
      <InstantiateAskMi />
    </div>
  {:else}
    <a
      class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
      href={`/instance/${$askMiStore['address']}`}
      ><Link />
      <p>Go to your AskMi instance</p>
    </a>
  {/if}
  <Leaderboard />
</div>
