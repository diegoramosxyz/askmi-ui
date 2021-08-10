<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import QuestionForm from '$lib/components/QuestionForm.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import { setUpAskMi } from '$lib/web3/initializers'
  // import QuestionersExport from '$lib/components/QuestionersExport.svelte'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let {
      VITE_ROPSTEN_ASKMI_FUNCTIONS,
      VITE_MUMBAI_ASKMI_FUNCTIONS,
      VITE_LOCALHOST_ASKMI_FUNCTIONS,
    } = import.meta.env

    const _chainId = await window.ethereum.request({ method: 'eth_chainId' })

    if (_chainId === '0x3') {
      // Set up event listeners and load stores with initial data
      await setUpAskMi(
        VITE_ROPSTEN_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )
    }
    if (_chainId === '0x13881') {
      await setUpAskMi(
        VITE_MUMBAI_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )
    }
    if (_chainId === '0x7a69') {
      await setUpAskMi(
        VITE_LOCALHOST_ASKMI_FUNCTIONS,
        $page.params.address,
        $page.query.get('questioner')
      )
    }
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
