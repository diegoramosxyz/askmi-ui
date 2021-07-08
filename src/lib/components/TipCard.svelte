<script lang="ts">
  import { factoryTip } from '$lib/web3/store'
  factoryTip.set(0)
</script>

<section class="mb-5 grid justify-center">
  <header>
    <h2 class="mb-3 text-lg">Select the cost to tip</h2>
  </header>
  <div class="grid gap-5">
    <article class="font-mono p-3 rounded ring-1 ring-trueGray-700">
      <section class="flex gap-2 justify-between items-end">
        <label class="mr-2 flex-1 font-medium block uppercase" for="tip"
          >Tip cost</label
        >
        <input
          name="tip"
          id="tip"
          required
          bind:value={$factoryTip}
          type="number"
          step="0.001"
          min="0"
          class="text-2xl font-bold rounded text-right bg-transparent w-28 focus:outline-none ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
          placeholder="0"
        />
        <p class="font-medium">ETH</p>
      </section>
    </article>
  </div>
</section>
