import { goto } from '$app/navigation'
import { askMiFactory, erc20Store } from '$lib/web3/store'
import type { BigNumber } from 'ethers'
import { get } from 'svelte/store'

export function instantiateAskMi(
  tiersToken: string,
  tipToken: string,
  tiers: BigNumber[],
  tip: BigNumber,
  removalFee: BigNumber
) {
  if (!!get(erc20Store).decimals) {
    // Deploy an AskMi instance
    get(askMiFactory).instantiateAskMi(
      tiersToken,
      tipToken,
      tiers,
      tip,
      removalFee
    )
    // Listen to the AskMiInstantiated event
    get(askMiFactory).once('AskMiInstantiated', (_askMiAddress: string) => {
      // Redirect user to the newly create AskMi instance
      goto(`/instance/${_askMiAddress}`)
    })
  }
}
