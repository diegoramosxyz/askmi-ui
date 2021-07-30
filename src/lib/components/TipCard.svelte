<script lang="ts">
  import { factoryTip, symbol } from '$lib/web3/store'
  factoryTip.set(0)
</script>

<section>
  <header class="mb-3">
    <h1 class="text-center text-lg font-bold">Select the cost to tip</h1>
  </header>
  <div class="grid gap-4">
    <article class="flex gap-2 items-end">
      <label for="tip">Tip</label>
      <input
        name="tip"
        id="tip"
        required
        bind:value={$factoryTip}
        type="number"
        step="0.0001"
        min="0"
        class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
        placeholder="0"
      />
      <span class="text-sm font-semibold"
        >{#if !!symbol}
          {$symbol}
        {:else}
          ETH
        {/if}</span
      >
    </article>
  </div>
</section>
