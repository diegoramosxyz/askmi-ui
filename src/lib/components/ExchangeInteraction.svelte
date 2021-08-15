<script lang="ts">
  import DollarSign from '$lib/svg/DollarSign.svelte'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'
  import Trash from '$lib/svg/Trash.svelte'
  import { issueTip, remove } from '$lib/abi-functions/askmi'
  import { askMiStore, derivedValues } from '$lib/stores/askMi'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
  export let tips: BigNumber

  $: isQuestioner = askMiStore.isQuestionerCheck(questioner)
</script>

<section class="flex gap-2 justify-end">
  {#if digest === '' && (isQuestioner || $derivedValues.isOwner)}
    <Button color="red" on:click={() => remove(questioner, exchangeIndex)}
      ><Trash /> Remove</Button
    >
  {/if}
  {#if digest !== '' && !$derivedValues.isOwner}
    <Button
      color="lime"
      on:click={async () => await issueTip(questioner, exchangeIndex)}
      ><DollarSign />Tips: {tips.toNumber()}</Button
    >
  {/if}
</section>
