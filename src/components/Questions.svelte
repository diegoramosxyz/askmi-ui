<script lang="ts">
  import { ethers } from 'ethers'
  import { getBytes32FromMultiash, getMultihashFromBytes32 } from '../utils/cid'
  import { questions, signer, owner, contract } from '../web3/store'
  import Link from './Link.svelte'

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
      {#each [...questions].reverse() as { question, answer, qIndex, balance }}
        <article class="px-3 py-2 ring-1 ring-trueGray-700 rounded">
          <section class="grid gap-2 mb-4">
            <Link
              href={`https://ipfs.io/ipfs/${getMultihashFromBytes32(question)}`}
              >Question</Link
            >
            {#if answer.digest !== ''}
              <Link
                href={`https://ipfs.io/ipfs/${getMultihashFromBytes32(answer)}`}
                >Answer</Link
              >
            {/if}
            <p>Price: {ethers.utils.formatEther(balance)} ETH</p>
          </section>
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
