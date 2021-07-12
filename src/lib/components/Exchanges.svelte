<script lang="ts">
  import { BigNumber, ethers } from 'ethers'
  import { shrinkAddress } from '$lib/utils/ui'
  import { questions, signer, askMi } from '$lib/web3/store'
  import { removeQuestion } from '$lib/web3/tools'
  import AnswerForm from './AnswerForm.svelte'

  async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
    $askMi.issueTip(questioner, exchangeIndex, {
      value: await $askMi.tip(),
    })

    $askMi.once(
      'TipIssued',
      async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
        console.log('Tip issued!')
    )
  }
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
            {#if digest === '' && questioner === $signer}
              <button
                on:click={() => removeQuestion(questioner, exchangeIndex)}
                class="px-3 py-1 bg-red-700 text-white rounded">Remove</button
              >
            {/if}
            {#if digest !== ''}
              <button
                on:click={async () =>
                  await tipAsnwer(questioner, exchangeIndex)}
                class="px-3 py-1 bg-green-700 text-white rounded">Tip</button
              >
            {/if}
          </article>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No questions to answer.</p>
  {/if}
</section>
