<script lang="ts">
  import { factoryTiers } from '$lib/web3/store'
  factoryTiers.set([
    {
      name: 'First',
      value: 0,
    },
    {
      name: 'Second',
      value: 0,
    },
    {
      name: 'Third',
      value: 0,
    },
  ])
</script>

<section class="mb-5 grid justify-center">
  <header>
    <h2 class="mb-3 text-lg">
      Select your tiers <span class="text-sm">(Min. 1 tier)</span>
    </h2>
  </header>
  <div class="grid gap-5">
    {#each $factoryTiers as { name, value }, i}
      <article class="font-mono p-3 rounded ring-1 ring-trueGray-700">
        <section class="flex gap-2 justify-between items-end">
          <label class="mr-2 flex-1 font-medium block uppercase" for={name}
            >{name} tier</label
          >
          <input
            {name}
            id={name}
            bind:value
            required={i === 0}
            type="number"
            step="0.001"
            min="0"
            class="text-2xl font-bold rounded text-right bg-transparent w-28 focus:outline-none ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
            placeholder="0"
          />
          <p class="font-medium">ETH</p>
        </section>
      </article>
    {/each}
  </div>
</section>
