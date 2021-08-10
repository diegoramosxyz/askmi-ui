<script lang="ts">
  import TierCards from '$lib/components/TierCards.svelte'
  import TipCard from '$lib/components/TipCard.svelte'
  import RemovalFee from '$lib/components/RemovalFee.svelte'
  import Button from '$lib/components/Button.svelte'
  import Terminal from '$lib/svg/Terminal.svelte'
  import { instantiateAskMi } from '$lib/abi-functions/askmi-factory'
  import { BigNumber } from '@ethersproject/bignumber'
  import { utils } from 'ethers'
  import TokenSelect from './TokenSelect.svelte'
  import Pending from './Pending.svelte'
  import { userInputs } from '$lib/stores/userInputs'

  $: tiers = userInputs.tiersAsArray($userInputs['tiers'])
  $: tip = utils.parseUnits($userInputs['tip'].toString(), 18)
  $: removalFee = BigNumber.from($userInputs['removalFee'])
</script>

<div
  class="px-5 py-3 col-start-1 row-start-1 grid gap-6 place-items-center rounded ring-1 ring-trueGray-800"
>
  <header>
    <h1 class="text-xl font-bold text-center">Deploy an AskMi instance</h1>
  </header>
  <TierCards>
    <div slot="selector">
      <TokenSelect tipOrTiers="tiersToken" />
    </div>
  </TierCards>
  <TipCard>
    <div slot="selector">
      <TokenSelect tipOrTiers="tipToken" />
    </div>
  </TipCard>
  <RemovalFee />
  <p>Developer fee: <span class="font-mono">0.5%</span> of rewards.</p>
  <Pending>
    <Button
      click={() =>
        instantiateAskMi(
          $userInputs['tiersToken'],
          $userInputs['tipToken'],
          tiers,
          tip,
          removalFee
        )}
      color={'lime'}><Terminal />Deploy AskMi contract</Button
    >
  </Pending>
</div>
