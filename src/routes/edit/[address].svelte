<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import {
    askMiStore,
    tiersUpdated,
    tipUpdated,
    userInputs,
  } from '$lib/web3/store'
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import Link from '$lib/svg/Link.svelte'
  import Button from '$lib/components/Button.svelte'
  import Cog from '$lib/svg/Cog.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import { updateTiers, updateTip } from '$lib/abi-functions/askmi'
  import TokenSelect from '$lib/components/TokenSelect.svelte'
  import SupportedTokensSelect from '$lib/components/SupportedTokensSelect.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let {
      VITE_ROPSTEN_CHAIN_ID,
      VITE_ROPSTEN_ERC20,
      VITE_ROPSTEN_ASKMI_FUNCTIONS,
      VITE_MUMBAI_CHAIN_ID,
      VITE_MUMBAI_ERC20,
      VITE_MUMBAI_ASKMI_FUNCTIONS,
      VITE_LOCALHOST_CHAIN_ID,
      VITE_LOCALHOST_ERC20,
      VITE_LOCALHOST_ASKMI_FUNCTIONS,
    } = import.meta.env

    const _chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (_chainId === '0x3') {
      // Set up event listeners and load stores with initial data
      await setUpAskMi(
        VITE_ROPSTEN_ASKMI_FUNCTIONS,
        $page.params.address,
        VITE_ROPSTEN_CHAIN_ID,
        VITE_ROPSTEN_ERC20
      )
    }
    if (_chainId === '0x13881') {
      await setUpAskMi(
        VITE_MUMBAI_ASKMI_FUNCTIONS,
        $page.params.address,
        VITE_MUMBAI_CHAIN_ID,
        VITE_MUMBAI_ERC20
      )
    }
    if (_chainId === '0x7a69') {
      await setUpAskMi(
        VITE_LOCALHOST_ASKMI_FUNCTIONS,
        $page.params.address,
        VITE_LOCALHOST_CHAIN_ID,
        VITE_LOCALHOST_ERC20,
        $page.query.get('questioner')
      )
    }

    userInputs.tiers('slow', $askMiStore['_tiers'][''][0].toString())
    userInputs.tiers('medium', $askMiStore['_tiers'][''][1].toString())
    userInputs.tiers('fast', $askMiStore['_tiers'][''][2].toString())

    tiersUpdated.set(false)
    tipUpdated.set(false)
  })
</script>

<svelte:head>
  <title>Edit AskMi Instance</title>
</svelte:head>

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
    <div
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
    >
      <SupportedTokensSelect withInput={true} tipOrTiers={'tiersToken'} />
      {#if $tiersUpdated === true}
        <p
          class="px-2 py-0.5 rounded font-bold bg-trueGray-300 text-trueGray-900"
        >
          Tiers will update soon!
        </p>
      {/if}
      <TierCards />
      <Button click={() => updateTiers($userInputs['tiersToken'])} color="lime"
        ><Cog />Update Tiers</Button
      >
    </div>
    <div
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
    >
      {#if $tipUpdated === true}
        <p
          class="px-2 py-0.5 rounded font-bold bg-trueGray-300 text-trueGray-900"
        >
          The tip cost will update soon!
        </p>
      {/if}
      <TipCard />
      <Button click={() => updateTip($userInputs['tiersToken'])} color="lime"
        ><Cog />Update Tip</Button
      >
    </div>
  </div>
</Loading>
