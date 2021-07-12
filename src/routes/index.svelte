<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpAskMiFactory } from '$lib/web3/tools'
  import { askMiAddress } from '$lib/web3/store'
  import Navbar from '$lib/components/Navbar.svelte'
  import InstatiateContractForm from '$lib/components/InstatiateContractForm.svelte'
  import Loading from '$lib/components/Loading.svelte'
  import Link from '$lib/svg/Link.svelte'

  onMount(async () => {
    let { VITE_ASKMI_FACTORY, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMiFactory(VITE_ASKMI_FACTORY, VITE_CHAIN_ID)
  })
</script>

<main class="px-3 lg:px-0 max-w-screen-md mx-auto">
  <Navbar />
  <Loading>
    <!-- Check if the current signer alreadt has an AskMi contract -->
    {#if $askMiAddress === null}
      <InstatiateContractForm />
    {:else}
      <a
        class="flex items-center gap-2 col-start-1 row-start-1 hover:underline"
        href={`/instance/${$askMiAddress}`}
        ><Link />
        <p>Go to your AskMi instance</p>
      </a>
    {/if}
  </Loading>
</main>
