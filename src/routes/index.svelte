<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpWeb3 } from '../web3/tools'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { ethers } from 'ethers'
  import { contract, signer, owner, price } from '../web3/store'
  import Questions from '../components/Questions.svelte'

  onMount(async () => {
    let contractAddress = import.meta.env.VITE_DQANDA_HARDHAT_ADDRESS
    let chainId = import.meta.env.VITE_LOCALHOST_CHAIN_ID

    // Set up event listeners and load store with initial data
    await setUpWeb3(contractAddress, chainId)
  })

  let cid = ''
  function ask() {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $contract.ask(digest, hashFunction, size, {
      value: ethers.utils.parseEther('1.0'),
    })
  }
</script>

<main class="max-w-prose mx-auto my-3">
  <article class="grid gap-1 my-2">
    <p>Account: {$signer && $signer.address}</p>
  </article>

  {#if $owner && $signer && $owner !== $signer.address}
    <form class="flex gap-3 justify-center" on:submit|preventDefault={ask}>
      <input
        bind:value={cid}
        class="px-3 py-1 ring-1 rounded ring-gray-800"
        placeholder="CID"
      />
      <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
        >ASK</button
      >
    </form>
    <p>Price {$price} ETH</p>
  {/if}

  <Questions />
</main>
