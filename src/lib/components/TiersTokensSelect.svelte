<script lang="ts">
  import { askMiStore } from '$lib/stores/askMi'
  import { populateErc20Store } from '$lib/stores/erc20'
  import { tiersTokenNames } from '$lib/stores/other'
  import { userInputs } from '$lib/stores/userInputs'
  import ChebronDown from '$lib/svg/Chebron-Down.svelte'
  import { onMount } from 'svelte'

  onMount(async () => {
    userInputs.tiersToken($askMiStore['_supportedTokens'][0])
    userInputs.tipToken($askMiStore['_tip']['token'])
  })

  let menu: boolean = false
</script>

<div class="mb-3 grid gap-1 ring-1 ring-trueGray-800 rounded">
  <label class="sr-only" for="tipToken">Choose a token:</label>
  <div class="flex items-center w-60 gap-3 relative">
    <p class="select-none pl-2 mr-auto">
      {$tiersTokenNames[$userInputs['tiersToken']]}
    </p>

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
        {#each $askMiStore['_supportedTokens'] as token}
          <li
            class="select-none transition cursor-pointer px-2 py-0.5 hover:bg-trueGray-800"
            on:click={async () => {
              await populateErc20Store(token)
              userInputs['tiersToken'](token)
              menu = !menu
            }}
          >
            {$tiersTokenNames[token]}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
