import { goto } from '$app/navigation'
import {
  askMiFactory_ERC20,
  decimals,
  factoryTiers,
  factoryTip,
} from '$lib/web3/store'
import { utils } from 'ethers'
import { get } from 'svelte/store'

export function instantiateAskMi() {
  if (!!decimals) {
    let _tiers = get(factoryTiers)
      .filter(({ value }) => value > 0)
      .map(({ value }) => utils.parseUnits(value.toString(), get(decimals)))
    let _tip = utils.parseUnits(get(factoryTip).toString(), get(decimals))
    // Deploy an AskMi instance
    get(askMiFactory_ERC20).instantiateAskMi(_tiers, _tip)
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
