import { erc20Store } from '$lib/stores/erc20'
import { askMi, erc20 } from '$lib/stores/other'
import { web3Store } from '$lib/stores/web3'
import { get } from 'svelte/store'

export async function setAllowance() {
  erc20Store.setAllowance(
    await get(erc20).allowance(get(web3Store)['signer'], get(askMi).address)
  )
}

export async function setBalanceOf() {
  erc20Store.setBalanceOf(await get(erc20).balanceOf(get(web3Store)['signer']))
}
