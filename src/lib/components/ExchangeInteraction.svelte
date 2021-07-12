<script lang="ts">
  import { signer } from '$lib/web3/store'
  import { removeQuestion, tipAsnwer } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
</script>

{#if digest === '' && questioner === $signer}
  <Button color="red" on:click={() => removeQuestion(questioner, exchangeIndex)}
    >Remove</Button
  >
{/if}
{#if digest !== ''}
  <Button
    color="green"
    on:click={async () => await tipAsnwer(questioner, exchangeIndex)}
    >Tip</Button
  >
{/if}
