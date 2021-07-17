<script lang="ts">
  import DollarSign from '$lib/svg/DollarSign.svelte'

  import { owner, signer } from '$lib/web3/store'

  import { removeQuestion, tipAsnwer } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'
  import Trash from '$lib/svg/Trash.svelte'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
  export let tips: BigNumber
</script>

<section class="flex gap-2 justify-end">
  {#if (digest === '' && $signer.toLowerCase() === questioner.toLowerCase()) || (digest === '' && $owner.toLowerCase() === $signer.toLowerCase())}
    <Button color="red" click={() => removeQuestion(questioner, exchangeIndex)}
      ><Trash /> Remove</Button
    >
  {/if}
  {#if digest !== '' && !!$owner && !!$signer && $owner.toLowerCase() !== $signer.toLowerCase()}
    <Button
      color="lime"
      click={async () => await tipAsnwer(questioner, exchangeIndex)}
      ><DollarSign />Tips: {tips.toNumber()}</Button
    >
  {/if}
</section>
