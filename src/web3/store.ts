import type { ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'
import type { AskMi, Exchange } from './askmi'

interface MetaMaskSigner {
  address: string
  balance: number
}

export type questionsByQuestioner = {
  questioner: string
  questions: Exchange[]
}[]

export const contract: Writable<AskMi> = writable()
export const provider: Writable<ethers.providers.Web3Provider> = writable()
export const signer: Writable<MetaMaskSigner> = writable()
export const owner: Writable<string> = writable()
export const price: Writable<string> = writable()
export const questioners: Writable<string[]> = writable()
export const questions: Writable<questionsByQuestioner> = writable()
