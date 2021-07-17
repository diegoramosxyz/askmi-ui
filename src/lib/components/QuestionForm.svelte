<script lang="ts">
  import { ask } from '$lib/web3/tools'
  import { owner, tiers, textAreaContent, signer } from '$lib/web3/store'
  import Button from '$lib/components/Button.svelte'
  import Plus from '$lib/svg/Plus.svelte'
  import Blockie from './Blockie.svelte'

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
      bind:value={$textAreaContent}
      cols="40"
      rows="4"
      class="mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
      placeholder="Type here..."
    />
    <section class="flex gap-4 mb-2 items-center">
      <h1 class="font-bold text-lg">Tier:</h1>
      {#each $tiers as tier, i}
        <article class="flex gap-2 items-center">
          <input
            type="radio"
            id={tier}
            name="tier"
            bind:group={_tierIndex}
            value={i}
          />
          <label for={tier}>{tier} ETH</label>
        </article>
      {/each}
    </section>
    <Button color="lightBlue"><Plus /> Ask</Button>
  </form>
{/if}
