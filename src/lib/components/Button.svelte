<script lang="ts">
  export let color: 'amber' | 'lightBlue' | 'red' | 'green'
  let colors = {
    amber:
      'bg-amber-900 text-amber-50 hover:bg-amber-800 focus:ring-amber-500 focus:bg-amber-900',
    lightBlue:
      'bg-lightBlue-900 text-lightBlue-50 hover:bg-lightBlue-800 focus:ring-lightBlue-500 focus:bg-lightBlue-900',
    red: 'bg-red-900 text-red-50 hover:bg-red-800 focus:ring-red-500 focus:bg-red-900',
    green:
      'bg-green-900 text-green-50 hover:bg-green-800 focus:ring-green-500 focus:bg-green-900',
  }
</script>

<div class="mx-auto">
  <button
    on:click={$$props.click}
    class={`select-none transition focus:outline-none font-medium px-3 py-1.5 rounded focus:ring ${colors[color]}`}
    ><slot /></button
  >
</div>
