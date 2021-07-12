<script lang="ts">
  import { signer } from '$lib/web3/store'
  import { removeQuestion, tipAsnwer } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
</script>

{#if digest === '' && questioner === $signer}
  <button
    on:click={() => removeQuestion(questioner, exchangeIndex)}
    class="px-3 py-1 bg-red-700 text-white rounded">Remove</button
  >
{/if}
{#if digest !== ''}
  <button
    on:click={async () => await tipAsnwer(questioner, exchangeIndex)}
    class="px-3 py-1 bg-green-700 text-white rounded">Tip</button
  >
{/if}
