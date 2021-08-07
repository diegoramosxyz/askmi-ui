<script lang="ts">
  import { erc20Store, userInputs } from '$lib/web3/store'
</script>

<section>
  <header class="mb-3">
    <h1 class="text-center text-lg font-bold">Fee for deleting a question</h1>
  </header>
  <div class="grid gap-4">
    <article class="flex gap-2 items-end">
      <label for="removal">Removal Fee</label>
      <input
        name="removal"
        id="removal"
        required
        bind:value={$userInputs.removalFee}
        type="number"
        step="0.01"
        min="0"
        class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
        placeholder="0"
      />
      <span class="text-sm font-semibold"
        >{#if !!$erc20Store.symbol}
          {$erc20Store.symbol}
        {:else}
          ETH
        {/if}</span
      >
    </article>
  </div>
</section>
