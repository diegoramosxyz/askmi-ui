<script lang="ts">
  import { factoryTiers, symbol } from '$lib/web3/store'
  factoryTiers.set([
    {
      name: 'Slow',
      value: 0,
    },
    {
      name: 'Medium',
      value: 0,
    },
    {
      name: 'Fast',
      value: 0,
    },
  ])
</script>

<section>
  <header class="mb-3">
    <h2 class="text-center text-lg font-bold">
      Select the contract's tiers <span class="text-sm">(Min. 1 tier)</span>
    </h2>
  </header>
  <div class="grid gap-4 justify-center">
    {#each $factoryTiers as { name, value }, i}
      <article class="flex gap-2 items-end">
        <label class="flex-1" for={name}>{name}</label>
        <input
          {name}
          id={name}
          bind:value
          required={i === 0}
          type="number"
          step="0.0001"
          min="0"
          class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
          placeholder="0"
        />
        <span class="text-sm font-semibold">
          {#if !!symbol}
            {$symbol}
          {:else}
            ETH
          {/if}
        </span>
      </article>
    {/each}
  </div>
</section>
