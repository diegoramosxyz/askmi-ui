<script lang="ts">
  import PaperAirplane from '$lib/svg/PaperAirplane.svelte'
  import { owner, signer, textAreaContent } from '$lib/web3/store'
  import { respond } from '$lib/web3/tools'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'
  import marked from 'marked'
  import DOMPurify from 'dompurify'
  import Markdown from '$lib/svg/Markdown.svelte'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
</script>

{#if digest === '' && !!$owner && !!$signer && $owner.toLowerCase() === $signer.toLowerCase()}
  <details>
    <summary class="mb-2 flex gap-1 items-center"
      >Answer <ChebronDown /></summary
    >
    <form
      class="mb-5 grid justify-center"
      on:submit|preventDefault={async () => respond(questioner, exchangeIndex)}
    >
      <textarea
        bind:value={$textAreaContent}
        cols="40"
        rows="5"
        class="mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none  ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
        placeholder="Answer here..."
      />
      {#if $textAreaContent}
        <h2 class="flex gap-1 items-center font-semibold mb-1">
          <Markdown /> Preview
        </h2>
        <div class="mb-3">
          {@html DOMPurify.sanitize(marked($textAreaContent))}
        </div>
      {/if}
      <div class="flex gap-4">
        <Button color="lightBlue"><PaperAirplane /> Answer</Button>
      </div>
    </form>
  </details>
{/if}
