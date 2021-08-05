import { goto } from '$app/navigation'
import { askMiFactory_ERC20, decimals, removalFee } from '$lib/web3/store'
import { get } from 'svelte/store'

export function instantiateAskMi() {
  if (!!decimals) {
    // Deploy an AskMi instance
    get(askMiFactory_ERC20).instantiateAskMi(get(removalFee))
    // Listen to the AskMiInstantiated event
    get(askMiFactory_ERC20).once(
      'AskMiInstantiated',
      (_askMiAddress: string) => {
        // Redirect user to the newly create AskMi instance
        goto(`/instance/${_askMiAddress}`)
      }
    )
  }
}
