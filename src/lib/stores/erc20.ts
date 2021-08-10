import { BigNumber } from 'ethers'
import { writable } from 'svelte/store'

const bigZero = BigNumber.from(0)

export type ERC20Store = {
  approved: boolean
  symbol: string
  decimals: BigNumber
}

function createERC20Store() {
  const { subscribe, update } = writable<ERC20Store>({
    approved: false,
    decimals: bigZero,
    symbol: '',
  })

  return {
    subscribe,
    approved: (approved: ERC20Store['approved']) =>
      update((inputs) => ({ ...inputs, approved })),
    decimals: (decimals: ERC20Store['decimals']) =>
      update((inputs) => ({ ...inputs, decimals })),
    symbol: (symbol: ERC20Store['symbol']) =>
      update((inputs) => ({ ...inputs, symbol })),
  }
}

export const erc20Store = createERC20Store()
