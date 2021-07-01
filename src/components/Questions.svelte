<script lang="ts">
  import type { ethers } from 'ethers'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { questions, signer, owner, contract } from '../web3/store'

  let cid2 = ''
  function respond(questioner: string, qIndex: ethers.BigNumber) {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid2)
    // Call the ask function
    $contract.respond(questioner, digest, hashFunction, size, qIndex)
  }
</script>

{#if $questions}
  {#each $questions as { questioner, questions }}
    <p>{questioner}</p>
    <div class="grid gap-3 mb-5">
      {#each [...questions].reverse() as { question, answer, qIndex }}
        <article class="px-3 py-2 ring-1 ring-trueGray-700 rounded">
          <p>Question: {question.digest}</p>
          <p>Answer: {answer.digest}</p>
          {#if answer.digest === '' && questioner === $signer.address}
            <button
              on:click={() => $contract.removeQuestion(qIndex)}
              class="px-3 py-2 bg-red-700 text-white rounded">Remove</button
            >
          {/if}
          {#if answer.digest === '' && $owner === $signer.address}
            <input
              bind:value={cid2}
              class="px-3 py-1 ring-1 rounded ring-gray-800"
              placeholder="CID"
            />
            <button
              on:click={() => respond(questioner, qIndex)}
              class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
              >RESPOND</button
            >
          {/if}
        </article>
      {/each}
    </div>
  {/each}
{/if}
