<script lang="ts">
  import { factoryTip } from '$lib/web3/store'
  factoryTip.set(0)
</script>

<section>
  <header>
    <h2 class="mb-1 text-lg">Select the cost to tip</h2>
  </header>
  <div class="grid md:flex gap-5">
    <article class="bg-black p-3 rounded-md">
      <section class="grid gap-2 justify-between items-end">
        <label class="mr-2 flex-1 font-medium block uppercase" for="tip"
          >Tip</label
        >
        <div class="flex gap-3 items-end">
          <input
            name="tip"
            id="tip"
            required
            bind:value={$factoryTip}
            type="number"
            step="0.001"
            min="0"
            class="text-2xl font-bold text-right bg-transparent w-28 focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
            placeholder="0"
          />
          <p class="font-medium">ETH</p>
        </div>
      </section>
    </article>
  </div>
</section>
