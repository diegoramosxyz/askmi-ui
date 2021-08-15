<script lang="ts">
  import { askMiStore } from '$lib/stores/askMi'
  import { userInputs } from '$lib/stores/userInputs'
  let val = $askMiStore['_fees']['removal'].toNumber() / 100
  $: _ = userInputs.removalFee(Math.floor(val * 100))
</script>

<section class="grid place-items-center">
  <header class="mb-3">
    <h1 class="text-center text-lg font-bold">Fee for deleting a question</h1>
  </header>
  <div class="grid gap-4">
    <article class="flex gap-2 items-end">
      <label for="removal">Removal Fee</label>
      <!-- The removal fee must be multiplied by a 100 because -->
      <!-- in solidity fee.removal goes from 1 to 10000 -->
      <input
        name="removal"
        id="removal"
        bind:value={val}
        required
        type="number"
        step="0.01"
        min="0"
        max="100"
        class="flex-none text-xl font-bold text-right w-28 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
      />
      <span class="text-sm font-semibold">%</span>
    </article>
  </div>
</section>
