<script lang="ts">
  import PaperAirplane from '$lib/svg/PaperAirplane.svelte'
  import Trash from '$lib/svg/Trash.svelte'
  import { owner, signer, textAreaContent } from '$lib/web3/store'
  import { removeQuestion, respond } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
</script>

{#if digest === '' && !!$owner && !!$signer && $owner.toLowerCase() === $signer.toLowerCase()}
  <form
    class="mb-5 grid gap-3 justify-center"
    on:submit|preventDefault={async () => respond(questioner, exchangeIndex)}
  >
    <textarea
      bind:value={$textAreaContent}
      cols="40"
      rows="5"
      class="px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
      placeholder="Answer here..."
    />
    <div class="flex gap-4">
      <Button color="lightBlue"><PaperAirplane /> Answer</Button>
      <Button
        color="red"
        click={() => removeQuestion(questioner, exchangeIndex)}
        ><Trash /> Remove</Button
      >
    </div>
  </form>
{/if}
