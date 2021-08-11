import type { AskMi } from '$lib/abi-types/askmi'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import type { ERC20 } from '$lib/abi-types/erc20'
import type { ethers } from 'ethers'
import { Writable, writable } from 'svelte/store'

// UI
export const loading: Writable<boolean> = writable()
export const search: Writable<string> = writable('')
export const tipUpdated: Writable<boolean> = writable()
export const tiersUpdated: Writable<boolean> = writable()

// Contracts
export const askMi: Writable<AskMi> = writable()
export const askMiFactory: Writable<AskMiFactory> = writable()
export const erc20: Writable<ERC20> = writable()
export const functionsContract: Writable<string> = writable()

// Other
export const provider: Writable<ethers.providers.Web3Provider> = writable()
export const tiersTokenNames: Writable<{ [key: string]: string }> = writable({})
