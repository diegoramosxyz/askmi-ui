<script lang="ts">
  export let color: 'amber' | 'lightBlue' | 'red' | 'lime'
  let colors = {
    amber:
      'border-amber-300 text-amber-50 hover:bg-amber-800 ring-amber-500 focus:bg-amber-900',
    lightBlue:
      'border-lightBlue-300 text-lightBlue-50 hover:bg-lightBlue-800 ring-lightBlue-500 focus:bg-lightBlue-900',
    red: 'border-red-300 text-red-50 hover:bg-red-800 ring-red-500 focus:bg-red-900',
    lime: 'border-lime-300 text-lime-50 hover:bg-lime-800 ring-lime-500 focus:bg-lime-900',
  }
</script>

<button
  on:click={$$props.click}
  class={`w-min flex gap-1 items-center whitespace-nowrap select-none focus:outline-none transition ring-1 focus:ring-offset-2 ring-offset-trueGray-900 font-medium px-2 py-1 normal-case rounded-md ${colors[color]}`}
  ><slot /></button
>
