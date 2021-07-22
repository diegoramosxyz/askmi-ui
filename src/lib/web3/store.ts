import type { ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'
import type { AskMi, Exchange } from './askmi'
import type { AskMiFactory } from './askmi-factory'

export type questionsByQuestioner = {
  questioner: string
  questions: Exchange[]
}[]

export const askMi: Writable<AskMi> = writable()
export const askMiAddress: Writable<string | null> = writable()
export const askMiFactory: Writable<AskMiFactory> = writable()
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
