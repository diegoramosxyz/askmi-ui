<script lang="ts">
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import { askMiFactory, factoryTiers, factoryTip } from '$lib/web3/store'
  import { utils } from 'ethers'
  import { goto } from '$app/navigation'
  import Button from '$lib/components/Button.svelte'
  import Terminal from '$lib/svg/Terminal.svelte'

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

<form
  class="col-start-1 row-start-1 grid gap-6 place-items-center px-5 py-3 rounded ring-1 ring-trueGray-800"
  on:submit|preventDefault={() => instantiateAskMi()}
>
  <header>
    <h1 class="text-xl font-bold text-center">Deploy an AskMi instance</h1>
  </header>
  <TierCards />
  <TipCard />
  <p>Developer fee: <span class="font-mono">0.5%</span> of rewards.</p>
  <Button color={'lime'}><Terminal />Deploy AskMi contract</Button>
</form>
