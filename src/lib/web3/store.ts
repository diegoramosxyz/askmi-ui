import type { AskMi, Exchange, Fees, Tip } from '$lib/abi-types/askmi'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import type { ERC20 } from '$lib/abi-types/erc20'
import type { ethers } from 'ethers'
import { BigNumber } from 'ethers'
import { Writable, writable } from 'svelte/store'

export type UserInputs = {
  tiersToken: string
  tiers: { slow: number; medium: number; fast: number }
  tipToken: string
  tip: string
  textArea: string
}

export type ERC20Store = {
  approved: boolean
  symbol: string
  decimals: BigNumber
}

export type AskMiStore = {
  address: string
  _owner: string
  _disabled: boolean
  _tip: Tip
  _fees: Fees
  _questioners: string[]
  _exchanges: {
    [questioner: string]: Exchange[]
  }
  _supportedTokens: string[]
  _tiers: {
    [token: string]: BigNumber[]
  }
}

export type Web3Store = {
  provider: ethers.providers.Web3Provider | null
  signer: string
  chainId: string | null
  pendingTx: string | null
}

export type Leaderboard = {
  contract: string
  owner: string
  answeredCount: number
}[]

function createAskMiStore() {
  const { subscribe, update } = writable<AskMiStore>({
    address: '',
    _owner: '',
    _disabled: false,
    _tip: {
      token: '',
      tip: BigNumber.from(0),
    },
    _fees: {
      removal: BigNumber.from(0),
      developer: BigNumber.from(0),
    },
    _questioners: [],
    _exchanges: {},
    _supportedTokens: [],
    _tiers: {},
  })

  return {
    subscribe,
    increment: () =>
      update((askMi) => {
        return {
          ...askMi,
          boni: 'facio',
        }
      }),
  }
}

function createWeb3Store() {
  const { subscribe, update } = writable<Web3Store>({
    provider: null,
    signer: '',
    chainId: '',
    pendingTx: null,
  })

  return {
    subscribe,
    change: () =>
      update((web3Store) => {
        return {
          ...web3Store,
        }
      }),
  }
}

function createLeaderboard() {
  const { subscribe, update } = writable<Leaderboard>([])

  return {
    subscribe,
    change: () =>
      update((leaderboard) => {
        return {
          ...leaderboard,
        }
      }),
  }
}

function createUserInputs() {
  const { subscribe, update } = writable<UserInputs>({
    tiersToken: '',
    tiers: { slow: 0, medium: 0, fast: 0 },
    tipToken: '',
    tip: '',
    textArea: '',
  })

  return {
    subscribe,
    change: () =>
      update((inputs) => {
        return {
          ...inputs,
        }
      }),
  }
}

function createERC20Store() {
  const { subscribe, update } = writable<ERC20Store>({
    approved: false,
    decimals: BigNumber.from(0),
    symbol: '',
  })

  return {
    subscribe,
    change: () =>
      update((inputs) => {
        return {
          ...inputs,
        }
      }),
  }
}

export const askMiStore = createAskMiStore()
export const web3Store = createWeb3Store()
export const leaderboard = createLeaderboard()
export const userInputs = createUserInputs()
export const erc20Store = createERC20Store()

// UI
export const loading: Writable<boolean> = writable()
export const search: Writable<string> = writable()
export const tipUpdated: Writable<boolean> = writable()
export const tiersUpdated: Writable<boolean> = writable()

// Contracts
export const askMi: Writable<AskMi> = writable()
export const askMiFactory: Writable<AskMiFactory> = writable()
export const erc20: Writable<ERC20> = writable()
export const functionsContract: Writable<string> = writable()
