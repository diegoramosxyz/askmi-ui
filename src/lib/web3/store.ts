import type { ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'
import type { AskMi, Exchange } from './askmi'
import type { AskMiFactory } from './askmi-factory'

interface MetaMaskSigner {
  address: string
  balance: number
}

export type questionsByQuestioner = {
  questioner: string
  questions: Exchange[]
}[]

export const askMi: Writable<AskMi> = writable()
export const myAskMi: Writable<string> = writable()
export const askMiFactory: Writable<AskMiFactory> = writable()
export const provider: Writable<ethers.providers.Web3Provider> = writable()
export const signer: Writable<MetaMaskSigner> = writable()
export const owner: Writable<string> = writable()
export const tiers: Writable<string[]> = writable()
export const tip: Writable<string> = writable()
export const fee: Writable<string> = writable()
export const questioners: Writable<string[]> = writable()
export const questions: Writable<questionsByQuestioner> = writable()

export const factoryTiers: Writable<{ name: string; value: number }[]> =
  writable()
export const factoryTip: Writable<number> = writable()
