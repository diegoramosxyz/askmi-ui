import { get, writable } from 'svelte/store'
import { provider } from './other'

export type Web3Store = {
  signer: string
  chainId: string | null
  pendingTx: string | null
}

function createWeb3Store() {
  const { subscribe, update, set } = writable<Web3Store>({
    signer: '',
    chainId: null,
    pendingTx: null,
  })

  return {
    subscribe,
    set,
    signer: (signer: Web3Store['signer']) =>
      update((inputs) => ({ ...inputs, signer })),
    chainId: (chainId: Web3Store['chainId']) =>
      update((inputs) => ({ ...inputs, chainId })),
    pendingTx: (pendingTx: Web3Store['pendingTx']) =>
      update((inputs) => ({ ...inputs, pendingTx })),
  }
}

export const web3Store = createWeb3Store()

export async function populateWeb3Store() {
  let data: Web3Store = {
    signer: (await get(provider).listAccounts())[0],
    chainId: await window.ethereum.request({ method: 'eth_chainId' }),
    pendingTx: null,
  }

  web3Store.set(data)
}
