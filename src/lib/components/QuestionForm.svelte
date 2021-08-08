<script lang="ts">
  import { approve } from '$lib/web3/tools'
  import Button from '$lib/components/Button.svelte'
  import Plus from '$lib/svg/Plus.svelte'
  import Blockie from './Blockie.svelte'
  import Pending from './Pending.svelte'
  import InfoBubble from './InfoBubble.svelte'
  import { ask } from '$lib/abi-functions/askmi'
  import {
    askMiStore,
    erc20Store,
    userInputs,
    web3Store,
  } from '$lib/web3/store'
  import { utils } from 'ethers'
  import SupportedTokensSelect from './SupportedTokensSelect.svelte'

  let { isOwnerCheck } = askMiStore

  let index: number = 0

  $: isOwner = isOwnerCheck($web3Store['signer'], $askMiStore['_owner'])
  $: tiers = $askMiStore['_tiers'][$askMiStore._supportedTokens[0]].map(
    (tier) => utils.formatUnits(tier, 18)
  )
</script>

<!-- If the account is NOT the owner -->
{#if !isOwner}
  <div class="mb-5 grid justify-center">
    <p class="mb-2 p-1.5 flex gap-2 items-center">
      Ask
      <Blockie address={$askMiStore['_owner']} />
      a question:
    </p>
    <textarea
      disabled={!!$web3Store['pendingTx']}
      bind:value={$userInputs['textArea']}
      cols="40"
      rows="4"
      class="disabled:opacity-50 disabled:cursor-not-allowed mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
      placeholder="Type here..."
    />
    <div class="flex justify-between">
      <h1 class="font-bold text-lg mb-2">Tiers <InfoBubble /></h1>
      <SupportedTokensSelect withInput={false} tipOrTiers={'tiersToken'} />
    </div>
    <div class="flex justify-around mb-4">
      {#each tiers as tier, i}
        <article class="grid gap-1 justify-center">
          <input
            class="w-full"
            disabled={!!$web3Store['pendingTx']}
            type="radio"
            id={tier.toString()}
            name="tier"
            bind:group={index}
            value={i}
          />
          <label for={tier.toString()}>
            {#if !!$erc20Store['symbol']}
              {tier} {$erc20Store['symbol']}
            {:else}
              Ξ {tier}
            {/if}</label
          >
        </article>
      {/each}
    </div>
    <Pending>
      {#if $erc20Store['approved'] === true}
        <Button
          click={async () => await ask($askMiStore._supportedTokens[0], index)}
          color="lightBlue"><Plus /> Ask</Button
        >
      {/if}
      {#if $erc20Store['approved'] === false}
        <Button color="lime" click={() => approve()}
          >Approve spending {$erc20Store['symbol']}</Button
        >
      {/if}
    </Pending>
  </div>
{/if}
