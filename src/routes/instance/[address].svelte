<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import QuestionForm from '$lib/components/QuestionForm.svelte'
  import Loading from '$lib/components/Loading.svelte'
  // import QuestionersExport from '$lib/components/QuestionersExport.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi(
      $page.params.address,
      VITE_CHAIN_ID,
      $page.query.get('questioner')
    )
  })
</script>

<svelte:head>
  <title>AskMi Instance</title>
</svelte:head>

<Loading>
  <QuestionForm />
  <!-- <QuestionersExport /> -->
  <Exchanges />
</Loading>
