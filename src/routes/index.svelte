<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpWeb3 } from '../web3/tools'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { ethers } from 'ethers'
  import { contract, signer, owner } from '../web3/store'
  import Questions from '../components/Questions.svelte'
  import Navbar from '../components/Navbar.svelte'

  onMount(async () => {
    let { VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpWeb3(VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID)
  })

  function ask(cid: string) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $contract.ask(digest, hashFunction, size, {
      value: ethers.utils.parseEther('1.0'),
    })
  }

  let questionInputValue: string

  // Take the string from the textarea and
  // generate a FormData object to make the fetch request
  async function upload() {
    const formData = new FormData()
    formData.append('question', questionInputValue)

    let res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    })
    let { Hash } = await res.json()
    return Hash
  }
</script>

<main class="max-w-screen-md mx-auto">
  <Navbar />
  {#if $owner && $signer && $owner !== $signer.address}
    <form
      class="mb-5 grid gap-3 justify-center"
      on:submit|preventDefault={async () => {
        let hash = await upload()
        ask(hash)
      }}
    >
      <textarea
        bind:value={questionInputValue}
        cols="40"
        rows="7"
        class="px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
        placeholder="Ask a question here."
      />
      <div>
        <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
          >ASK</button
        >
      </div>
    </form>
  {/if}
  <Questions />
</main>
