<script lang="ts">
  import { ethers } from 'ethers'
  import { shrinkAddress } from '../utils/ui'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { questions, signer, owner, contract } from '../web3/store'

  let cid2 = ''
  function respond(questioner: string, qIndex: ethers.BigNumber) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid2)
    // Call the ask function
    $contract.respond(questioner, digest, hashFunction, size, qIndex)
  }

  let questionInputValue: string

  // let image: any = null
  async function upload() {
    // var response = await files[0].arrayBuffer()
    // let buffer = new Uint8Array(response)

    // Generate a link to render an image from a buffer
    // image = URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))

    const formData = new FormData()
    formData.append('question', questionInputValue)

    let res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    })
    let { Hash } = await res.json()
    cid2 = Hash
  }
</script>

<section class="mb-3 max-w-prose mx-auto">
  <header class="mb-3">
    <h1 class="text-xl font-medium">Questions</h1>
  </header>
  {#if $questions}
    {#each $questions as { questioner, questions }}
      <p class="pl-2 mb-2 font-mono">{shrinkAddress(questioner)}</p>
      <div class="grid gap-3 mb-6">
        {#each [...questions].reverse() as { answer, qIndex, balance, resolvedQuestion, resolvedAnswer }}
          <article class="p-3 mb-2 ring-1 ring-trueGray-700 rounded">
            <section class="grid gap-2 mb-4">
              <p class="font-semibold text-lg">{resolvedQuestion}</p>
              <!-- If the answer exists -->
              {#if answer.digest !== ''}
                <p>{resolvedAnswer}</p>
              {/if}
              {#if balance > ethers.BigNumber.from(0)}
                <p>Deposit: {ethers.utils.formatEther(balance)} ETH</p>
              {/if}
            </section>
            {#if answer.digest === '' && questioner === $signer.address}
              <button
                on:click={() => $contract.removeQuestion(qIndex)}
                class="px-3 py-2 bg-red-700 text-white rounded">Remove</button
              >
            {/if}
            {#if answer.digest === '' && $owner === $signer.address}
              <form
                class="mb-5 grid gap-3 justify-center"
                on:submit|preventDefault={async () => {
                  let hash = await upload()
                  respond(questioner, qIndex)
                }}
              >
                <textarea
                  bind:value={questionInputValue}
                  cols="40"
                  rows="5"
                  class="px-3 py-2 bg-transparent ring-1 ring-trueGray-700 rounded resize-y"
                  placeholder="Ask a question here."
                />
                <div>
                  <button
                    class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
                    >Answer</button
                  >
                </div>
              </form>
            {/if}
          </article>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No questions to answer.</p>
  {/if}
</section>
