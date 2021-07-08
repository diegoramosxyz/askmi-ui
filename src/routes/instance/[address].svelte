<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { setUpAskMi } from '$lib/web3/tools'
  import { getBytes32FromMultiash } from '$lib/utils/cid'
  import { BigNumber, utils } from 'ethers'
  import {
    askMi,
    signer,
    owner,
    tiers,
    questioners,
    questions,
  } from '$lib/web3/store'
  import Exchanges from '$lib/components/Exchanges.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import { getQuestionsSubset } from '$lib/web3/eventListeners'

  // TODO: Create function to check valid Ethereum addresses
  onMount(async () => {
    let { VITE_CHAIN_ID } = import.meta.env

    // Set up event listeners and load stores with initial data
    await setUpAskMi($page.params.address, VITE_CHAIN_ID, $page.path)
  })

  function ask(cid: string, _tierIndex: number) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $askMi.ask(digest, hashFunction, size, BigNumber.from(_tierIndex), {
      value: utils.parseEther($tiers[_tierIndex]),
    })
    $askMi.once(
      'QuestionAsked',
      async (_questioner: string, _exchangeIndex: BigNumber) =>
        await getQuestionsSubset($askMi, questioners, questions)
    )
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
      class="mb-5 grid justify-center"
      on:submit|preventDefault={async () => {
        let hash = await upload()
        ask(hash, 0)
      }}
    >
      <textarea
        bind:value={questionInputValue}
        cols="40"
        rows="7"
        class="mb-3 px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
        placeholder="Ask a question here."
      />
      <section class="flex gap-4 mb-2 items-center">
        <h1 class="font-bold text-lg">Tier</h1>
        {#each $tiers as tier, index}
          <article class="flex gap-2 items-center">
            <input type="radio" id={tier} name="tier" value={index} />
            <label for={tier}>{tier} ETH</label>
          </article>
        {/each}
      </section>
      <div>
        <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
          >ASK</button
        >
      </div>
    </form>
  {/if}
  <Exchanges />
</main>
