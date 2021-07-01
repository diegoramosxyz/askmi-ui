<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getProviderAndContract,
    initializeEventListeners,
    metaMaskChecks,
  } from '../web3/tools'
  import { getBytes32FromMultiash } from '../utils/cid'
  import { abi } from '../ABI/Dqanda.json'
  import { ethers } from 'ethers'
  import {
    provider,
    contract,
    signer,
    owner,
    price,
    questioners,
    questions,
  } from '../web3/store'
  import type { questionsByQuestioner } from '../web3/store'
  import Questions from '../components/Questions.svelte'

  onMount(async () => {
    let contractAddress = import.meta.env.VITE_DQANDA_HARDHAT_ADDRESS
    let chainId = import.meta.env.VITE_LOCALHOST_CHAIN_ID

    if (typeof contractAddress == 'string' && typeof chainId == 'string') {
      const { provider: web3Provider, contract: dQandA } =
        getProviderAndContract(contractAddress, abi)

      provider.set(web3Provider)
      contract.set(dQandA)

      metaMaskChecks($provider)
      initializeEventListeners(chainId, $provider, $contract)

      owner.set((await $contract.owner()).toLocaleLowerCase())
      price.set(ethers.utils.formatEther(await $contract.price()))

      // Get questioners and remove the first element of the array
      let qrs = (await $contract.getQuestioners()).slice(1)
      questioners.set(qrs)

      let qs: questionsByQuestioner = []
      // WARNING TODO: Limit the amount of questioners queried
      // Create a Questions object for each questioner
      $questioners.map(async (questioner) => {
        qs.push({
          questioner: questioner.toLocaleLowerCase(),
          questions: await $contract.getQuestions(questioner),
        })
        // Research why this is the only way to make this work
        questions.set(qs)
      })
    }
  })

  let cid = ''
  function ask() {
    // Conver CID into a multihash object
    let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
    // Call the ask function
    $contract.ask(digest, hashFunction, size, {
      value: ethers.utils.parseEther('1.0'),
    })
  }
</script>

<main class="max-w-prose mx-auto my-3">
  <article class="grid gap-1 my-2">
    <p>Account: {$signer && $signer.address}</p>
  </article>

  {#if $owner && $signer && $owner !== $signer.address}
    <form class="flex gap-3 justify-center" on:submit|preventDefault={ask}>
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
  {/if}

  <Questions />
</main>
