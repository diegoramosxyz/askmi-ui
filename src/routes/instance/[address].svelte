<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import QuestionForm from '$lib/components/QuestionForm.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import { approved } from '$lib/web3/store'
  import Approve from '$lib/components/Approve.svelte'
  // import QuestionersExport from '$lib/components/QuestionersExport.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID, VITE_ERC20 } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi(
      $page.params.address,
      VITE_CHAIN_ID,
      VITE_ERC20,
      $page.query.get('questioner')
    )
  })
</script>

<svelte:head>
  <title>AskMi Instance</title>
</svelte:head>

<Loading>
  {#if !!approved && $approved === true}
    <QuestionForm />
  {/if}
  {#if !!approved && $approved === false}
    <Approve />
  {/if}
  <!-- <QuestionersExport /> -->
  <Exchanges />
</Loading>
