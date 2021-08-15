<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import Link from '$lib/svg/Link.svelte'
  import Button from '$lib/components/Button.svelte'
  import Cog from '$lib/svg/Cog.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import {
    updateRemovalFee,
    updateTiers,
    updateTip,
  } from '$lib/abi-functions/askmi'
  import SupportedTokensSelect from '$lib/components/SupportedTokensSelect.svelte'
  import { utils } from 'ethers'
  import { userInputs } from '$lib/stores/userInputs'
  import { askMiStore } from '$lib/stores/askMi'
  import { tiersTokenNames } from '$lib/stores/other'
  import { setUpAskMi } from '$lib/web3/initializers'
  import { getTokenNamesWithTipToken } from '$lib/abi-functions/erc20'
  import RemovalFee from '$lib/components/RemovalFee.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let {
      VITE_ROPSTEN_ASKMI_FUNCTIONS,
      VITE_MUMBAI_ASKMI_FUNCTIONS,
      VITE_LOCALHOST_ASKMI_FUNCTIONS,
    } = import.meta.env

    const _chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (_chainId === '0x3') {
      // Set up event listeners and load stores with initial data
      await setUpAskMi(
        VITE_ROPSTEN_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )
    }
    if (_chainId === '0x13881') {
      await setUpAskMi(
        VITE_MUMBAI_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )
    }
    if (_chainId === '0x7a69') {
      await setUpAskMi(
        VITE_LOCALHOST_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )

      tiersTokenNames.set(await getTokenNamesWithTipToken())
    }

    userInputs.tiers(
      'slow',
      utils.formatUnits($askMiStore['_tiers'][$userInputs['tiersToken']][0], 18)
    )
    userInputs.tiers(
      'medium',
      utils.formatUnits(
        $askMiStore['_tiers'][$userInputs['tiersToken']][1] || 0,
        18
      )
    )
    userInputs.tiers(
      'fast',
      utils.formatUnits(
        $askMiStore['_tiers'][$userInputs['tiersToken']][2] || 0,
        18
      )
    )
  })
</script>

<svelte:head>
  <title>Edit AskMi Instance</title>
</svelte:head>

<Loading>
  <a
    class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
    href="/instance/{$page.params.address}"
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
      <TierCards>
        <div slot="selector">
          <SupportedTokensSelect tipOrTiers={'tiersToken'} />
        </div>
      </TierCards>
      <Button
        on:click={() => updateTiers($userInputs['tiersToken'])}
        color="lime"><Cog />Update Tiers</Button
      >
    </div>
    <div
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
    >
      <TipCard>
        <div slot="selector">
          <SupportedTokensSelect tipOrTiers={'tipToken'} />
        </div>
      </TipCard>
      <Button on:click={() => updateTip($userInputs['tiersToken'])} color="lime"
        ><Cog />Update Tip</Button
      >
    </div>
    <div
      class="grid gap-4 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
    >
      <RemovalFee />
      <Button on:click={() => updateRemovalFee()} color="lime"
        ><Cog />Update Removal Fee</Button
      >
    </div>
  </div>
</Loading>
