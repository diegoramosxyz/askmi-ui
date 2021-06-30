import type { ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'
import type { dQandA } from './contract'

export const contract: Writable<dQandA> = writable()
export const provider: Writable<ethers.providers.Web3Provider> = writable()
export const signer: Writable<string> = writable()
