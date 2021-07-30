import type { BigNumber, ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'
import type { AskMi, ERC20, Exchange } from './askmi'
import type { AskMiFactory } from './askmi-factory'

export type questionsByQuestioner = {
  questioner: string
  questions: Exchange[]
}[]

export const askMi: Writable<AskMi> = writable()
export const askMi_ERC20: Writable<AskMi> = writable()
export const askMiAddress: Writable<string | null> = writable()
export const askMiFactory: Writable<AskMiFactory> = writable()
export const askMiFactory_ERC20: Writable<AskMiFactory> = writable()
export const provider: Writable<ethers.providers.Web3Provider> = writable()
export const signer: Writable<string> = writable()
export const chainId: Writable<string | null> = writable()
export const owner: Writable<string> = writable()
export const tiers: Writable<string[]> = writable()
export const tip: Writable<string> = writable()
export const fee: Writable<string> = writable()
export const questioners: Writable<string[]> = writable()
export const questions: Writable<questionsByQuestioner> = writable()
export const loading: Writable<boolean> = writable()

export const factoryTiers: Writable<{ name: string; value: number }[]> =
  writable()
export const factoryTip: Writable<number> = writable()

export const textAreaContent: Writable<string> = writable()
export const tipUpdated: Writable<boolean> = writable()
export const tiersUpdated: Writable<boolean> = writable()
export const pendingTx: Writable<string | null> = writable()
export const leaderboard: Writable<
  { contract: string; owner: string; answeredCount: number }[]
> = writable()
export const search: Writable<string> = writable()

// ERC20
export const erc20: Writable<ERC20> = writable()
export const approved: Writable<boolean> = writable()
export const symbol: Writable<string> = writable()
export const decimals: Writable<BigNumber> = writable()
