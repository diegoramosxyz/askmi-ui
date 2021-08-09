import { askMiFactory, askMiStore, web3Store } from '$lib/web3/store'
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
  let { wait } = await get(askMiFactory).instantiateAskMi(
    tiersToken,
    tipToken,
    tiers,
    tip,
    removalFee
  )
  await wait()

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
