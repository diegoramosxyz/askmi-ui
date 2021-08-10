import { writable } from 'svelte/store'

export type Web3Store = {
  // provider: ethers.providers.Web3Provider
  signer: string
  chainId: string | null
  pendingTx: string | null
}

function createWeb3Store() {
  const { subscribe, update } = writable<Web3Store>({
    signer: '',
    chainId: '',
    pendingTx: '',
  })

  return {
    subscribe,
    // provider: (provider: Web3Store['provider']) =>
    //   update((inputs) => ({ ...inputs, provider })),
    signer: (signer: Web3Store['signer']) =>
      update((inputs) => ({ ...inputs, signer })),
    chainId: (chainId: Web3Store['chainId']) =>
      update((inputs) => ({ ...inputs, chainId })),
    pendingTx: (pendingTx: Web3Store['pendingTx']) =>
      update((inputs) => ({ ...inputs, pendingTx })),
  }
}

export const web3Store = createWeb3Store()
