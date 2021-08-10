import { BigNumber, constants, Contract } from 'ethers'
import { get, writable } from 'svelte/store'
import { abi as erc20ABI } from '$lib/abi/MyToken.json'
import { askMi, erc20, provider } from './other'
import type { ERC20 } from '$lib/abi-types/erc20'
import { web3Store } from './web3'

const bigZero = BigNumber.from(0)

export type ERC20Store = {
  name: string | null
  symbol: string | null
  decimals: BigNumber | null
  totalSupply: BigNumber | null
  allowance: BigNumber | null
  balanceOf: BigNumber | null
}

function createERC20Store() {
  const { subscribe, update, set } = writable<ERC20Store>({
    name: '',
    symbol: '',
    decimals: bigZero,
    totalSupply: bigZero,
    allowance: bigZero,
    balanceOf: bigZero,
  })

  return {
    subscribe,
    set,
    setAllowance: (allowance: ERC20Store['allowance']) =>
      update((inputs) => ({ ...inputs, allowance })),
    setBalanceOf: (balanceOf: ERC20Store['balanceOf']) =>
      update((inputs) => ({ ...inputs, balanceOf })),
  }
}

export const erc20Store = createERC20Store()

export async function populateErc20Store(contractAddress: string) {
  if (contractAddress === constants.AddressZero) {
    erc20Store.set({
      name: null,
      symbol: null,
      decimals: null,
      totalSupply: null,
      allowance: null,
      balanceOf: null,
    })
  } else {
    erc20.set(
      new Contract(
        contractAddress,
        erc20ABI,
        get(provider).getSigner()
      ) as ERC20
    )

    erc20Store.set({
      name: await get(erc20).name(),
      symbol: await get(erc20).symbol(),
      decimals: await get(erc20).decimals(),
      totalSupply: await get(erc20).totalSupply(),
      allowance: await get(erc20).allowance(
        get(web3Store)['signer'],
        get(askMi).address
      ),
      balanceOf: await get(erc20).balanceOf(get(web3Store)['signer']),
    })
  }
}
