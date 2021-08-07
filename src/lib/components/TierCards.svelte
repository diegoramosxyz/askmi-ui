<script lang="ts">
  import { erc20Store, userInputs } from '$lib/web3/store'
  import type { UserInputs } from '$lib/web3/store'

  let keys = Object.keys($userInputs.tiers) as Array<keyof UserInputs['tiers']>
</script>

<section>
  <header class="mb-3">
    <h2 class="text-center text-lg font-bold">
      Select the contract's tiers <span class="text-sm">(Min. 1 tier)</span>
    </h2>
  </header>
  <div class="grid gap-4 justify-center">
    {#each keys as key, i}
      <article class="flex gap-2 items-end">
        <label class="flex-1 capitalize" for={key}>{key}</label>
        <input
          name={key}
          id={key}
          bind:value={$userInputs.tiers[key]}
          required={i === 0}
          type="number"
          step="0.01"
          min="0"
          class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
          placeholder="0"
        />
        <span class="text-sm font-semibold">
          {#if !!$erc20Store.symbol}
            {$erc20Store.symbol}
          {:else}
            ETH
          {/if}
        </span>
      </article>
    {/each}
  </div>
</section>
