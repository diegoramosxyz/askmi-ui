<script lang="ts">
  import { userInputs } from '$lib/stores/userInputs'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'
  export let tipOrTiers: 'tipToken' | 'tiersToken'

  let defaultTokens: { [key: string]: string } = {
    '0x0000000000000000000000000000000000000000': 'Ethereum',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3': 'Dai',
  }

  let addresses = Object.keys(defaultTokens)

  $: tokenIsDefault = addresses.includes($userInputs[tipOrTiers])

  let menu: boolean = false
</script>

<div class="mb-3 grid gap-1 ring-1 ring-trueGray-800 rounded">
  <label class="sr-only" for="tipToken">Choose a token:</label>
  <div class="flex items-center w-60 gap-3 relative">
    {#if !tokenIsDefault}
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
      <div class="pl-2 mr-auto">{defaultTokens[$userInputs[tipOrTiers]]}</div>
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
        <li
          on:click={() => {
            userInputs[tipOrTiers]('')
            menu = !menu
          }}
          class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
        >
          Custom token
        </li>
        {#each addresses as token}
          <li
            class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
            on:click={() => {
              userInputs[tipOrTiers](token)
              menu = !menu
            }}
          >
            {defaultTokens[token]}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
