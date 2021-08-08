<script lang="ts">
  import PaperAirplane from '$lib/svg/PaperAirplane.svelte'
  import type { BigNumber } from '@ethersproject/bignumber'
  import Button from './Button.svelte'
  import marked from 'marked'
  import DOMPurify from 'dompurify'
  import Markdown from '$lib/svg/Markdown.svelte'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'
  import Pending from './Pending.svelte'
  import { respond } from '$lib/abi-functions/askmi'
  import { askMiStore, userInputs, web3Store } from '$lib/web3/store'
  let { isOwnerCheck } = askMiStore

  export let digest: string
  export let questioner: string
  export let exchangeIndex: BigNumber

  $: isOwner = isOwnerCheck($web3Store['signer'], $askMiStore['_owner'])
</script>

{#if digest === '' && isOwner}
  <Pending>
    <details>
      <summary class="mb-2 flex gap-1 items-center"
        >Answer <ChebronDown /></summary
      >
      <form
        class="mb-5 grid justify-center"
        on:submit|preventDefault={async () =>
          respond(questioner, exchangeIndex)}
      >
        <textarea
          bind:value={$userInputs['textArea']}
          cols="40"
          rows="5"
          class="mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
          placeholder="Answer here..."
        />
        {#if $userInputs['textArea']}
          <h2 class="flex gap-1 items-center font-semibold mb-1">
            <Markdown /> Preview
          </h2>
          <div class="mb-3">
            {@html DOMPurify.sanitize(marked($userInputs['textArea']))}
          </div>
        {/if}
        <div class="flex gap-4">
          <Button color="lightBlue"><PaperAirplane /> Answer</Button>
        </div>
      </form>
    </details>
  </Pending>
{/if}
