<script lang="ts">
  import { onMount } from 'svelte'
  import {
    getProviderAndContract,
    initializeEventListeners,
    metaMaskChecks,
  } from '../web3/tools'
  import { getBytes32FromMultiash, getMultihashFromBytes32 } from '../utils/cid'
  import { abi } from '../ABI/Dqanda.json'
  import { ethers } from 'ethers'
  import { provider, contract } from '../web3/store'

  onMount(async () => {
    let contractAddress = import.meta.env.VITE_DQANDA_HARDHAT_ADDRESS
    let NETWORK_ID = import.meta.env.VITE_LOCALHOST_NETWORK_ID

    if (typeof contractAddress == 'string' && typeof NETWORK_ID == 'string') {
      const { provider: web3Provider, contract: dQandA } =
        getProviderAndContract(contractAddress, abi)

      provider.set(web3Provider)
      contract.set(dQandA)

      metaMaskChecks()
      initializeEventListeners(NETWORK_ID, $provider, $contract)
    }
  })

  let cid = ''
  function handlesubmit() {
    let bytes32
    let multihash
    bytes32 = getBytes32FromMultiash(cid)
    console.log({ bytes32 })
    multihash = getMultihashFromBytes32(bytes32)
    console.log({ multihash })
  }
</script>

<main class="max-w-prose mx-auto my-3">
  <form class="grid justify-center" on:submit|preventDefault={handlesubmit}>
    <input
      bind:value={cid}
      class="px-3 py-1 ring-1 rounded ring-gray-800"
      placeholder="CID"
    />
  </form>
  <button
    on:click={async () =>
      console.log(
        await $contract.ask(
          'jeff',
          ethers.BigNumber.from(18),
          ethers.BigNumber.from(32),
          {
            value: ethers.utils.parseEther('1.0'),
          }
        )
      )}>ASK</button
  >
</main>
