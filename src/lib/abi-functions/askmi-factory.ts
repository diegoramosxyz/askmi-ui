import { askMiStore } from '$lib/stores/askMi'
import { askMiFactory } from '$lib/stores/other'
import { web3Store } from '$lib/stores/web3'
import type { BigNumber } from 'ethers'
import { get } from 'svelte/store'

export async function instantiateAskMi(
  tiersToken: string,
  tipToken: string,
  tiers: BigNumber[],
  tip: BigNumber,
  removalFee: BigNumber
) {
  // Deploy an AskMi instance
  let { hash, wait } = await get(askMiFactory).instantiateAskMi(
    tiersToken,
    tipToken,
    tiers,
    tip,
    removalFee
  )
  web3Store.pendingTx(hash)

  await wait()

  web3Store.pendingTx(null)

  // Listen to the AskMiInstantiated event
  get(askMiFactory).once('AskMiInstantiated', (askMiAddress: string) =>
    askMiStore.address(askMiAddress)
  )
}

export async function getMyAskMi() {
  try {
    let askMiAddress = await get(askMiFactory).getMyAskMi(get(web3Store).signer)
    askMiStore.address(askMiAddress)
  } catch {
    askMiStore.address(null)
  }
}
