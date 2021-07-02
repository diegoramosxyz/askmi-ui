<script lang="ts">
  import { onMount } from 'svelte'
  import { setUpWeb3 } from '../web3/tools'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { ethers } from 'ethers'
  import { contract, signer, owner, price } from '../web3/store'
  import Questions from '../components/Questions.svelte'

  onMount(async () => {
    let { VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpWeb3(VITE_CONTRACT_ADDRESS, VITE_CHAIN_ID)
  })

  let cid = ''
  function ask(cid: string) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $contract.ask(digest, hashFunction, size, {
      value: ethers.utils.parseEther('1.0'),
    })
  }

  let files: FileList
  // let image: any = null
  async function upload() {
    // var response = await files[0].arrayBuffer()
    // let buffer = new Uint8Array(response)

    // Generate a link to render an image from a buffer
    // image = URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))

    const formData = new FormData()
    formData.append('document', files[0])

    let res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    })
    let { Hash } = await res.json()
    return Hash
  }
</script>

<main class="max-w-prose mx-auto my-3">
  {#if $owner && $signer}
    <article class="grid gap-1 my-2">
      <p>Account: {$signer.address}</p>
    </article>
    {#if $owner !== $signer.address}
      <form
        class="flex gap-3 justify-center"
        on:submit|preventDefault={() => ask(cid)}
      >
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
      <form
        class="my-4"
        on:submit|preventDefault={async () => {
          let hash = await upload()
          ask(hash)
        }}
      >
        <input bind:files type="file" />

        <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
          >ASK</button
        >
      </form>
      <!-- Render an image submitted by the user -->
      <!-- {#if image}
        <img src={image} alt="Svelte logo" />
      {/if} -->
    {/if}
  {/if}

  <Questions />
</main>
