<script lang="ts">
  import { leaderboard, provider, search, web3Store } from '$lib/web3/store'
  import { onMount } from 'svelte'
  import Blockie from './Blockie.svelte'

  //   initialize search
  onMount(() => search.set(''))

  function getResults(address: string) {
    let owners = $leaderboard.filter((row) => row.owner.startsWith(address))
    let contracts = $leaderboard.filter((row) =>
      row.contract.startsWith(address)
    )
    if (owners.length > 0 || contracts.length > 0) {
      return { owners, contracts }
    }
    return { owners: [], contracts: [] }
  }

  async function filter(address: string) {
    if (!!$leaderboard) {
      if (address.endsWith('.eth')) {
        let resolved = await $provider.resolveName(address)
        return getResults(resolved)
      } else {
        return getResults(address)
      }
    }
    return { owners: [], contracts: [] }
  }

  $: results = filter($search)
</script>

<div class="relative">
  <input
    type="search"
    autocomplete="off"
    id="search"
    class="h-full pl-2 w-56 bg-transparent focus:outline-none rounded ring-1 ring-trueGray-700 transition focus:ring-trueGray-400"
    placeholder="Search by address or ENS"
    name="search"
    bind:value={$search}
  />
  <label class="sr-only" for="search">Search</label>
  {#if !!$search && $search !== ''}
    <div
      class="bg-trueGray-900 p-2 space-y-3 absolute top-11 left-0 w-full ring-1 rounded ring-trueGray-800"
    >
      {#await results}
        <p class="px-2 py-1">Searching...</p>
      {:then results}
        {#if results.owners.length > 0}
          <section>
            <p class="mb-1 px-2 py-1">Responders</p>
            {#each results.owners as { owner, contract }}
              <a
                class="block p-1 no-underline hover:underline"
                href={`/instance/${contract}`}><Blockie address={owner} /></a
              >
            {/each}
          </section>
        {/if}
        {#if results.contracts.length > 0}
          <section>
            <p class="mb-1 px-2 py-1">Contracts</p>
            {#each results.contracts as { contract }}
              <a
                class="block p-1 no-underline hover:underline"
                href={`/instance/${contract}`}><Blockie address={contract} /></a
              >
            {/each}
          </section>
        {/if}
        {#if results.owners.length === 0 && results.contracts.length === 0}
          <p class="px-2 py-1">No matches</p>
        {/if}
      {/await}
    </div>
  {/if}
</div>
