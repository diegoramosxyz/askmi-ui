<script lang="ts">
  import DollarSign from '$lib/svg/DollarSign.svelte'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'
  import Trash from '$lib/svg/Trash.svelte'
  import { issueTip, remove } from '$lib/abi-functions/askmi'
  import { askMiStore } from '$lib/stores/askMi'
  import { web3Store } from '$lib/stores/web3'
  let { isOwnerCheck, isQuestionerCheck } = askMiStore

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
  export let tips: BigNumber

  $: isOwner = isOwnerCheck($web3Store['signer'], $askMiStore['_owner'])
  $: isQuestioner = isQuestionerCheck('test', $web3Store['signer'])
</script>

<section class="flex gap-2 justify-end">
  {#if digest === '' && (isQuestioner || isOwner)}
    <Button color="red" click={() => remove(questioner, exchangeIndex)}
      ><Trash /> Remove</Button
    >
  {/if}
  {#if digest !== '' && !isOwner}
    <Button
      color="lime"
      click={async () => await issueTip(questioner, exchangeIndex)}
      ><DollarSign />Tips: {tips.toNumber()}</Button
    >
  {/if}
</section>
