<script lang="ts">
  import { erc20Store, userInputs } from '$lib/web3/store'
  import TokenSelect from './TokenSelect.svelte'
</script>

<section class="grid place-items-center">
  <header class="mb-3">
    <h1 class="text-center text-lg font-bold">Select the cost to tip</h1>
  </header>
  <TokenSelect tipOrTiers="tipToken" />
  <div class="grid gap-4">
    <article class="flex gap-2 items-end">
      <label for="tip">Tip</label>
      <input
        name="tip"
        id="tip"
        required
        bind:value={$userInputs['tip']}
        type="number"
        step="0.01"
        min="0"
        class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
        placeholder="0"
      />
      <span class="text-sm font-semibold"
        >{#if !!$erc20Store['symbol']}
          {$erc20Store['symbol']}
        {:else}
          ETH
        {/if}</span
      >
    </article>
  </div>
</section>
