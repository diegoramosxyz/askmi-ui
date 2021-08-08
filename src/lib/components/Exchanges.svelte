<script lang="ts">
  import { ethers } from 'ethers'
  import AnswerForm from './AnswerForm.svelte'
  import ExchangeInteraction from './ExchangeInteraction.svelte'
  import marked from 'marked'
  import DOMPurify from 'dompurify'
  import Blockie from './Blockie.svelte'
  import {
    getMultihashFromBytes32 as getCid,
    resolveIpfs,
  } from '$lib/utils/cid'
  import { page } from '$app/stores'
  import { askMiStore, erc20Store } from '$lib/web3/store'
</script>

<section class="mb-3 max-w-prose mx-auto">
  <header class="mb-3 flex items-center justify-between">
    <h1 class="text-xl font-medium">Questions</h1>
    {#if !!$page.query.get('questioner')}
      <a rel="external" href={$page.path}>Clear filter</a>
    {/if}
  </header>
  {#if $askMiStore['_questioners'] && $askMiStore['_questioners'].length !== 0}
    {#each $askMiStore['_questioners'] as questioner}
      <section class="grid justify-start mb-3">
        <a
          href={`${$page.path}?questioner=${questioner}`}
          class="no-underline hover:ring-1 ring-trueGray-700 rounded transition p-1.5 flex gap-2"
        >
          <Blockie address={questioner} />
        </a>
      </section>
      <div class="grid gap-5 mb-6">
        {#each [...$askMiStore['_exchanges'][questioner]].reverse() as { answer, question, index, balance, tips }}
          <article
            class="px-4 py-3 rounded max-w-prose ring-1 ring-trueGray-800"
          >
            {#if balance > ethers.BigNumber.from(0)}
              <p class="mb-2 flex gap-2 items-center">
                <span
                  class="font-mono flex items-center text-sm font-bold px-2 pt-1 rounded-md bg-lime-200 text-lime-900"
                  >Reward: {ethers.utils.formatEther(balance)}
                  {#if !!$erc20Store['symbol']}
                    {$erc20Store['symbol']}
                  {:else}
                    ETH
                  {/if}
                </span>
              </p>
            {/if}
            <header class="mb-3 flex gap-3 items-center">
              {#await resolveIpfs(getCid(question))}
                <p>...waiting</p>
              {:then questionText}
                <h1 class="text-lg font-semibold">{questionText}</h1>
              {:catch}
                <p class="text-red-600 font-mono">Data unavailable</p>
              {/await}
            </header>
            <!-- If the answer exists -->
            {#if answer.digest !== ''}
              <section class="ml-3 mb-3">
                <div class="mb-3">
                  {#await resolveIpfs(getCid(answer))}
                    <p>...waiting</p>
                  {:then asnwerText}
                    {@html DOMPurify.sanitize(marked(asnwerText || ''))}
                  {:catch}
                    <p class="text-red-600 font-mono">Data unavailable</p>
                  {/await}
                </div>
              </section>
            {/if}
            <AnswerForm
              digest={answer.digest}
              exchangeIndex={index}
              {questioner}
            />
            <ExchangeInteraction
              {tips}
              digest={answer.digest}
              exchangeIndex={index}
              {questioner}
            />
          </article>
        {/each}
      </div>
    {/each}
  {:else}
    <p>No questions to answer.</p>
  {/if}
</section>
