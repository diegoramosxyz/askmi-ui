<script lang="ts">
  import { approve } from '$lib/web3/tools'
  import {
    owner,
    tiers,
    textAreaContent,
    signer,
    pendingTx,
    symbol,
    approved,
  } from '$lib/web3/store'
  import Button from '$lib/components/Button.svelte'
  import Plus from '$lib/svg/Plus.svelte'
  import Blockie from './Blockie.svelte'
  import Pending from './Pending.svelte'
  import InfoBubble from './InfoBubble.svelte'
  import { ask } from '$lib/abi-functions/askmi'

  let _tierIndex: number = 0
</script>

<!-- If the account is NOT the owner -->
{#if !!$owner && !!$signer && $owner.toLowerCase() !== $signer.toLowerCase()}
  <form
    class="mb-5 grid justify-center"
    on:submit|preventDefault={async () => await ask(_tierIndex)}
  >
    <p class="mb-2 p-1.5 flex gap-2 items-center">
      Ask
      <Blockie address={$owner} />
      a question:
    </p>
    <textarea
      disabled={!!$pendingTx}
      bind:value={$textAreaContent}
      cols="40"
      rows="4"
      class="disabled:opacity-50 disabled:cursor-not-allowed mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
      placeholder="Type here..."
    />
    <h1 class="font-bold text-lg mb-2">Tiers <InfoBubble /></h1>
    <div class="flex justify-around mb-4">
      {#each $tiers as tier, i}
        <article class="grid gap-1 justify-center">
          <input
            class="w-full"
            disabled={!!$pendingTx}
            type="radio"
            id={tier}
            name="tier"
            bind:group={_tierIndex}
            value={i}
          />
          <label for={tier}>
            {#if !!symbol}
              {tier} {$symbol}
            {:else}
              Ξ {tier}
            {/if}</label
          >
        </article>
      {/each}
    </div>
    <Pending>
      {#if !!approved && $approved === true}
        <Button color="lightBlue"><Plus /> Ask</Button>
      {/if}
      {#if !!approved && $approved === false}
        <Button color="lime" click={() => approve()}
          >Approve spending {$symbol}</Button
        >
      {/if}
    </Pending>
  </form>
{/if}
