<script lang="ts">
  import { askMiStore } from '$lib/stores/askMi'
  import { erc20Store, populateErc20Store } from '$lib/stores/erc20'
  import { userInputs } from '$lib/stores/userInputs'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'
  import { onMount } from 'svelte'
  import Blockie from './Blockie.svelte'
  export let withInput: boolean
  export let tipOrTiers: 'tipToken' | 'tiersToken'

  onMount(() => {
    userInputs.tiersToken($askMiStore['_supportedTokens'][0])
    userInputs.tipToken($askMiStore['_tip']['token'])
  })

  let knownTokens: { [key: string]: string } = {
    '0x0000000000000000000000000000000000000000': 'Ethereum',
    // '0x5FbDB2315678afecb367f032d93F642f64180aa3': 'Dai',
  }

  $: supportedTokens = Array.from(
    new Set([...$askMiStore['_supportedTokens'], $askMiStore['_tip']['token']])
  )
  let knownAddresses = Object.keys(knownTokens)

  let menu: boolean = false
</script>

<div class="mb-3 grid gap-1 ring-1 ring-trueGray-800 rounded">
  <label class="sr-only" for="tipToken">Choose a token:</label>
  <div class="flex items-center w-60 gap-3 relative">
    {#if withInput}
      {#if !knownAddresses.includes($userInputs[tipOrTiers])}
        <input
          type="text"
          autocomplete="off"
          id="tipToken"
          class="h-full pl-2 w-full bg-trueGray-900 focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
          placeholder="ERC20 token address"
          name="tipToken"
          bind:value={$userInputs[tipOrTiers]}
        />
      {:else}
        <div class="pl-2 mr-auto">{knownTokens[$userInputs[tipOrTiers]]}</div>
      {/if}
    {:else if knownAddresses.includes($userInputs[tipOrTiers])}
      <p class="select-none pl-2 mr-auto">
        {knownTokens[$userInputs[tipOrTiers]]}
      </p>
    {:else}
      <p class="select-none pl-2 mr-auto">
        {$erc20Store['name']}
      </p>
    {/if}

    <button
      class="p-1 ring-1 ring-trueGray-800 rounded"
      on:click={() => (menu = !menu)}
    >
      <ChebronDown />
    </button>
    {#if menu}
      <ul
        class="w-full max-h-28 bg-trueGray-900 overflow-auto top-9 absolute ring-1 ring-trueGray-700 rounded"
      >
        {#if withInput}
          <li
            on:click={async () => {
              userInputs[tipOrTiers]('')
              menu = !menu
            }}
            class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
          >
            Add token
          </li>
          {#each supportedTokens as token}
            <li
              class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
              on:click={async () => {
                userInputs[tipOrTiers](token)
                await populateErc20Store(token)
                menu = !menu
              }}
            >
              {knownTokens[token]}
            </li>
          {/each}
        {:else}
          {#each supportedTokens as token}
            <li
              class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
              on:click={async () => {
                userInputs[tipOrTiers](token)
                await populateErc20Store(token)
                menu = !menu
              }}
            >
              {#if knownAddresses.includes(token)}
                {knownTokens[token]}
              {:else}
                <Blockie address={token} />
              {/if}
            </li>
          {/each}
        {/if}
      </ul>
    {/if}
  </div>
</div>
