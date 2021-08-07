<script lang="ts">
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import RemovalFee from '$lib/components/RemovalFee.svelte'
  import Button from '$lib/components/Button.svelte'
  import Terminal from '$lib/svg/Terminal.svelte'
  import { instantiateAskMi } from '$lib/abi-functions/askmi-factory'
  import { functionsContract, userInputs } from '$lib/web3/store'
  import { BigNumber } from '@ethersproject/bignumber'

  $: tiers = userInputs.tiersAsArray($userInputs.tiers)
  $: tip = BigNumber.from($userInputs.tip)
  $: removalFee = BigNumber.from($userInputs.removalFee)
</script>

<form
  class="px-5 py-3 col-start-1 row-start-1 grid gap-6 place-items-center rounded ring-1 ring-trueGray-800"
  on:submit|preventDefault={() =>
    instantiateAskMi(
      $functionsContract,
      $userInputs.tiersToken,
      $userInputs.tipToken,
      tiers,
      tip,
      removalFee
    )}
>
  <header>
    <h1 class="text-xl font-bold text-center">Deploy an AskMi instance</h1>
  </header>
  <TierCards />
  <TipCard />
  <RemovalFee />
  <p>Developer fee: <span class="font-mono">0.5%</span> of rewards.</p>
  <Button color={'lime'}><Terminal />Deploy AskMi contract</Button>
</form>
