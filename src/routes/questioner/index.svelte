<script lang="ts">
  import { page } from '$app/stores'
  import { questioners } from '../../web3/store'
  import { setUpWeb3 } from '../../web3/tools'
  import { onMount } from 'svelte'

  onMount(async () => {
    let { VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpWeb3(VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID, $page.path)
  })
</script>

{JSON.stringify($questioners, null, 2)}
