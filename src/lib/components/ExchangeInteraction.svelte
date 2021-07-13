<script lang="ts">
  import { owner, signer } from '$lib/web3/store'
  import { removeQuestion, tipAsnwer } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
</script>

{#if digest === '' && questioner.toLowerCase() === $signer.toLowerCase()}
  <Button color="red" click={() => removeQuestion(questioner, exchangeIndex)}
    >Remove</Button
  >
{/if}
{#if digest !== '' && $owner.toLowerCase() !== $signer.toLowerCase()}
  <Button
    color="green"
    click={async () => await tipAsnwer(questioner, exchangeIndex)}>Tip</Button
  >
{/if}
