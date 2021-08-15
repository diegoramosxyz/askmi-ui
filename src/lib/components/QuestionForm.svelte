<script lang="ts">
  import Button from '$lib/components/Button.svelte'
  import Plus from '$lib/svg/Plus.svelte'
  import Blockie from './Blockie.svelte'
  import InfoBubble from './InfoBubble.svelte'
  import { ask } from '$lib/abi-functions/askmi'
  import { constants, utils } from 'ethers'
  import { askMiStore, derivedValues } from '$lib/stores/askMi'
  import { web3Store } from '$lib/stores/web3'
  import { userInputs } from '$lib/stores/userInputs'
  import { erc20Store } from '$lib/stores/erc20'
  import { approve } from '$lib/abi-functions/erc20'
  import TiersTokensSelect from './TiersTokensSelect.svelte'

  let index: number = 0
  let value = ''

  $: tiers = $askMiStore['_tiers'][$userInputs['tiersToken']].map((tier) =>
    utils.formatUnits(tier, 18)
  )
  $: approved = $erc20Store.allowance?.gt(0)
</script>

<!-- If the account is NOT the owner -->
{#if !$derivedValues.isOwner}
  <div class="mb-5 grid justify-center">
    <p class="mb-2 p-1.5 flex gap-2 items-center">
      Ask
      <Blockie address={$askMiStore['_owner']} />
      a question:
    </p>
    <textarea
      disabled={!!$web3Store['pendingTx']}
      bind:value
      cols="40"
      rows="4"
      class="disabled:opacity-50 disabled:cursor-not-allowed mb-3 px-3 py-2 bg-transparent ring-1 transition focus:outline-none ring-trueGray-700 focus:ring-trueGray-500 rounded resize-y"
      placeholder="Type here..."
    />
    <div class="flex justify-between">
      <h1 class="font-bold text-lg mb-2">Tiers <InfoBubble /></h1>
      <TiersTokensSelect />
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
    {#if $userInputs['tiersToken'] !== constants.AddressZero}
      {#if approved === true}
        <Button
          on:click={async () =>
            await ask(value, $userInputs['tiersToken'], index)}
          color="lightBlue"><Plus /> Ask</Button
        >
      {/if}
      {#if approved === false}
        <Button color="lime" on:click={() => approve()}
          >Approve spending {$erc20Store['symbol']}</Button
        >
      {/if}
    {:else}
      <Button
        on:click={async () =>
          await ask(value, $userInputs['tiersToken'], index)}
        color="lightBlue"><Plus /> Ask</Button
      >
    {/if}
  </div>
{/if}
