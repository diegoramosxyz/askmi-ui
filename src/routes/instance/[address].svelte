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
    await setUpAskMi($page.params.address, VITE_CHAIN_ID)
  })

  function ask(cid: string, _tierIndex: number) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $askMi.ask(digest, hashFunction, size, BigNumber.from(_tierIndex), {
      value: utils.parseEther($tiers[_tierIndex]),
    })
    // Update questions when event has been emitted
    $askMi.once(
      'QuestionAsked',
      async (_questioner: string, _exchangeIndex: BigNumber) =>
        await getQuestionsSubset($askMi, questioners, questions)
    )
  }

  let textAreaContent: string
  let index: number

  // Take the string from the textarea and
  // generate a FormData object to make the fetch request
  async function upload() {
    const formData = new FormData()
    formData.append('question', textAreaContent)

    const res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    })
    const { Hash } = await res.json()
    ask(Hash, index)
  }
</script>

<main class="max-w-screen-md mx-auto">
  <Navbar />
  {#if $owner && $signer && $owner.toLowerCase() !== $signer.toLowerCase()}
    <form
      class="mb-5 grid justify-center"
      on:submit|preventDefault={async () => await upload()}
    >
      <textarea
        bind:value={textAreaContent}
        cols="40"
        rows="7"
        class="mb-3 px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
        placeholder="Ask a question here."
      />
      <section class="flex gap-4 mb-2 items-center">
        <h1 class="font-bold text-lg">Tier</h1>
        {#each $tiers as tier, i}
          <article class="flex gap-2 items-center">
            <input
              type="radio"
              id={tier}
              name="tier"
              bind:group={index}
              value={i}
            />
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
