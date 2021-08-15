<script lang="ts">
  import PaperAirplane from '$lib/svg/PaperAirplane.svelte'
  import Button from './Button.svelte'
  import marked from 'marked'
  import DOMPurify from 'dompurify'
  import Markdown from '$lib/svg/Markdown.svelte'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'
  import Pending from './Pending.svelte'
  import { respond } from '$lib/abi-functions/askmi'
  import { web3Store } from '$lib/stores/web3'
  import { askMiStore } from '$lib/stores/askMi'
  import { userInputs } from '$lib/stores/userInputs'
  import type { BigNumber } from '@ethersproject/bignumber'
  let { isOwnerCheck } = askMiStore

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber
  let value = ''

  $: isOwner = isOwnerCheck($web3Store['signer'], $askMiStore['_owner'])
</script>

{#if digest === '' && isOwner}
  <details>
    <summary class="mb-2 flex gap-1 items-center"
      >Answer <ChebronDown /></summary
    >
    <form
      class="mb-5 grid justify-center"
      on:submit|preventDefault={async () =>
        respond(value, questioner, exchangeIndex)}
    >
      <textarea
        bind:value
        cols="40"
        rows="5"
        class="mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
        placeholder="Answer here..."
      />
      {#if value !== ''}
        <h2 class="flex gap-1 items-center font-semibold mb-1">
          <Markdown /> Preview
        </h2>
        <div class="mb-3">
          {@html DOMPurify.sanitize(marked(value))}
        </div>
      {/if}
      <div class="flex gap-4">
        <Button color="lightBlue"><PaperAirplane /> Answer</Button>
      </div>
    </form>
  </details>
{/if}
