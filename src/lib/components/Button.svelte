<script lang="ts">
  export let color: 'amber' | 'lightBlue' | 'red' | 'lime'
  let colors = {
    amber:
      'border-amber-300 text-amber-50 hover:bg-amber-800 focus:ring-amber-500 focus:bg-amber-900',
    lightBlue:
      'border-lightBlue-300 text-lightBlue-50 hover:bg-lightBlue-800 focus:ring-lightBlue-500 focus:bg-lightBlue-900',
    red: 'border-red-300 text-red-50 hover:bg-red-800 focus:ring-red-500 focus:bg-red-900',
    lime: 'border-lime-300 text-lime-50 hover:bg-lime-800 focus:ring-lime-500 focus:bg-lime-900',
  }
</script>

<button
  on:click={$$props.click}
  class={`flex gap-1 items-center select-none focus:outline-none focus:ring-2 transition border-2 font-medium px-2 py-1 normal-case rounded-md ${colors[color]}`}
  ><slot /></button
>
