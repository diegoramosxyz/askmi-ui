<script lang="ts">
  import { ethers } from 'ethers'
  import { shrinkAddress } from '$lib/utils/ui'
  import { questions } from '$lib/web3/store'
  import AnswerForm from './AnswerForm.svelte'
  import ExchangeInteraction from './ExchangeInteraction.svelte'
</script>

<section class="mb-3 max-w-prose mx-auto">
  <header class="mb-3">
    <h1 class="text-xl font-medium">Questions</h1>
  </header>
  {#if $questions && $questions.length !== 0}
    {#each $questions as { questioner, questions }}
      <a href={`/questioner/${questioner}`}>
        <p class="pl-2 mb-2 font-mono">{shrinkAddress(questioner)}</p>
      </a>
      <div class="grid gap-3 mb-6">
        {#each [...questions].reverse() as { answer: { digest }, exchangeIndex, balance, resolvedQuestion, resolvedAnswer }}
          <article class="p-3 mb-2 ring-1 ring-trueGray-700 rounded">
            <section class="grid gap-2 mb-4">
              <p class="font-semibold text-lg">{resolvedQuestion}</p>
              <!-- If the answer exists -->
              {#if digest !== ''}
                <p>{resolvedAnswer}</p>
              {/if}
              {#if balance > ethers.BigNumber.from(0)}
                <p>Deposit: {ethers.utils.formatEther(balance)} ETH</p>
              {/if}
            </section>
            <AnswerForm {digest} {exchangeIndex} {questioner} />
            <ExchangeInteraction {digest} {exchangeIndex} {questioner} />
          </article>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No questions to answer.</p>
  {/if}
</section>
