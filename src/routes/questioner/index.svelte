<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit'

  export function load({ page: { path } }: LoadInput) {
    return {
      props: {
        path,
      },
    }
  }
</script>

<script lang="ts">
  import { questioners } from '../../web3/store'
  import { setUpWeb3 } from '../../web3/tools'
  import { onMount } from 'svelte'
  // Get the path from the module
  export let path: string

  onMount(async () => {
    let { VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpWeb3(VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID, path)
  })
</script>

{JSON.stringify($questioners, null, 2)}
