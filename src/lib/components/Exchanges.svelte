<script lang="ts">
  import { ethers } from 'ethers'
  import { shrinkAddress } from '$lib/utils/ui'
  import { questions } from '$lib/web3/store'
  import AnswerForm from './AnswerForm.svelte'
  import ExchangeInteraction from './ExchangeInteraction.svelte'
  import { getBlockie } from '$lib/web3/tools'
  import marked from 'marked'
  import DOMPurify from 'dompurify'
</script>

<section class="mb-3 max-w-prose mx-auto">
  <header class="mb-3">
    <h1 class="text-xl font-medium">Questions</h1>
  </header>
  {#if $questions && $questions.length !== 0}
    {#each $questions as { questioner, questions }}
      <section class="grid justify-start mb-3">
        <div class="p-1.5 flex gap-2">
          <img
            class="rounded h-6"
            src={getBlockie(questioner)}
            alt="Blockie from questioner's address"
          />
          <p class="font-mono pt-0.5">
            {shrinkAddress(questioner)}
          </p>
        </div>
      </section>
      <div class="grid gap-5 mb-6">
        {#each [...questions].reverse() as { answer: { digest }, exchangeIndex, balance, resolvedQuestion, resolvedAnswer, tips }}
          <article
            class="px-4 py-3 rounded max-w-prose ring-1 ring-trueGray-800"
          >
            <!-- <section class="flex justify-end">
              <button class="px-2 py-1 rounded flex gap-1 items-center bg-amber-200 text-amber-900">
                <DollarSign/>
                <p>Tips <span class="font-mono">908</span></p>
              </button>
            </section> -->

            {#if balance > ethers.BigNumber.from(0)}
              <p class="mb-2 flex gap-2 items-center">
                <span
                  class="font-mono flex items-center text-sm font-bold px-2 pt-1 rounded-md bg-lime-200 text-lime-900"
                  >Reward: {ethers.utils.formatEther(balance)} ETH</span
                >
              </p>
            {/if}
            <header class="mb-3 flex gap-3 items-center">
              <h1 class="text-lg font-semibold">{resolvedQuestion}</h1>
            </header>
            <!-- If the answer exists -->
            {#if digest !== ''}
              <section class="ml-3 mb-3">
                <div class="mb-3">
                  {@html DOMPurify.sanitize(marked(resolvedAnswer || ''))}
                </div>
              </section>
            {/if}
            <AnswerForm {digest} {exchangeIndex} {questioner} />
            <ExchangeInteraction {tips} {digest} {exchangeIndex} {questioner} />
          </article>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No questions to answer.</p>
  {/if}
</section>
