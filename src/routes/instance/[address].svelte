<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import QuestionForm from '$lib/components/QuestionForm.svelte'
  import Loading from '$lib/components/Loading.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)
  })
</script>

<Loading>
  <QuestionForm />
  <Exchanges />
</Loading>
