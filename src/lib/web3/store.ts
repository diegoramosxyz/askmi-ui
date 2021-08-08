import type { AskMi, Exchange, Fees, Tip } from '$lib/abi-types/askmi'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import type { ERC20 } from '$lib/abi-types/erc20'
import { BigNumber, ethers, constants, utils } from 'ethers'
import { Writable, writable } from 'svelte/store'

const bigZero = BigNumber.from(0)

export type UserInputs = {
  tiersToken: string
  tiers: {
    slow: number
    medium: number
    fast: number
  }
  tipToken: string
  tip: number
  textArea: string
  removalFee: number
}

export type ERC20Store = {
  approved: boolean
  symbol: string
  decimals: BigNumber
}

export type AskMiStore = {
  address: string | null
  _owner: string
  _disabled: boolean
  _tip: Tip
  _fees: Fees
  _questioners: string[]
  _exchanges: {
    [key: string]: Exchange[]
  }
  _supportedTokens: string[]
  _tiers: {
    [key: string]: BigNumber[]
  }
}

export type Web3Store = {
  // provider: ethers.providers.Web3Provider
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
    address: null,
    _owner: '',
    _disabled: false,
    _tip: {
      token: constants.AddressZero,
      tip: bigZero,
    },
    _fees: {
      removal: bigZero,
      developer: bigZero,
    },
    _questioners: [],
    _exchanges: {},
    _supportedTokens: [],
    _tiers: {},
  })

  return {
    subscribe,
    address: (address: AskMiStore['address']) =>
      update((data) => ({ ...data, address })),
    _owner: (_owner: AskMiStore['_owner']) =>
      update((data) => ({ ...data, _owner })),
    _disabled: (_disabled: AskMiStore['_disabled']) =>
      update((data) => ({ ...data, _disabled })),
    _tip: (_tip: AskMiStore['_tip']) => update((data) => ({ ...data, _tip })),
    _fees: (_fees: AskMiStore['_fees']) =>
      update((data) => ({ ...data, _fees })),
    _questioners: (_questioners: AskMiStore['_questioners']) =>
      update((data) => ({ ...data, _questioners })),
    _exchanges: (_exchanges: AskMiStore['_exchanges']) =>
      update((data) => ({ ...data, _exchanges })),
    _supportedTokens: (_supportedTokens: AskMiStore['_supportedTokens']) =>
      update((data) => ({ ...data, _supportedTokens })),
    _tiers: (_tiers: AskMiStore['_tiers']) =>
      update((data) => ({ ...data, _tiers })),
    sliceQuestioners: (allQuestioners: string[]) =>
      update((data) => ({
        ...data,
        _questioners: allQuestioners.slice(1).slice(-5),
      })),
    updateOneExchange: (questioner: string, exchanges: Exchange[]) =>
      update((data) => ({
        ...data,
        _exchanges: {
          ...data._exchanges,
          [questioner]: exchanges,
        },
      })),
    plusOneTips: (questioner: string, index: number) =>
      update((data) => ({
        ...data,
        _exchanges: {
          ...data._exchanges,
          [questioner]: data._exchanges[questioner].splice(index, 1, {
            ...data._exchanges[questioner][index],
            tips: BigNumber.from(
              data._exchanges[questioner][index].tips.toNumber() + 1
            ),
          }),
        },
      })),
    removeOneExchange: (questioner: string, index: number) =>
      update((data) => ({
        ...data,
        _exchanges: {
          ...data._exchanges,
          [questioner]: data._exchanges[questioner].splice(index, 1),
        },
      })),
    isOwnerCheck: (signer: Web3Store['signer'], _owner: AskMiStore['_owner']) =>
      !!signer && !!_owner && signer.toLowerCase() === _owner.toLowerCase(),
    isQuestionerCheck: (questioner: string, signer: Web3Store['signer']) =>
      questioner.toLowerCase() === signer.toLowerCase(),
  }
}

function createWeb3Store() {
  const { subscribe, update } = writable<Web3Store>({
    signer: '',
    chainId: '',
    pendingTx: '',
  })

  return {
    subscribe,
    // provider: (provider: Web3Store['provider']) =>
    //   update((inputs) => ({ ...inputs, provider })),
    signer: (signer: Web3Store['signer']) =>
      update((inputs) => ({ ...inputs, signer })),
    chainId: (chainId: Web3Store['chainId']) =>
      update((inputs) => ({ ...inputs, chainId })),
    pendingTx: (pendingTx: Web3Store['pendingTx']) =>
      update((inputs) => ({ ...inputs, pendingTx })),
  }
}

function createLeaderboard() {
  const { subscribe, set } = writable<Leaderboard>([])

  return { subscribe, set }
}

function createUserInputs() {
  const { subscribe, update, set } = writable<UserInputs>({
    tiersToken: constants.AddressZero,
    tiers: { slow: 0, medium: 0, fast: 0 },
    tipToken: constants.AddressZero,
    tip: 0,
    textArea: '',
    removalFee: 0,
  })

  return {
    subscribe,
    set,
    tiersToken: (tiersToken: UserInputs['tiersToken']) =>
      update((inputs) => ({ ...inputs, tiersToken })),
    tiers: (key: keyof UserInputs['tiers'], value: string) =>
      update((inputs) => ({
        ...inputs,
        tiers: {
          ...inputs.tiers,
          [key]: value,
        },
      })),
    tipToken: (tipToken: UserInputs['tipToken']) =>
      update((inputs) => ({ ...inputs, tipToken })),
    tip: (tip: UserInputs['tip']) => update((inputs) => ({ ...inputs, tip })),
    textArea: (textArea: UserInputs['textArea']) =>
      update((inputs) => ({ ...inputs, textArea })),
    removalFee: (removalFee: UserInputs['removalFee']) =>
      update((inputs) => ({ ...inputs, removalFee })),
    tiersAsArray: (tiers: UserInputs['tiers']) => {
      let keys = Object.keys(tiers) as Array<keyof UserInputs['tiers']>
      let values = keys.map((key) => utils.parseUnits(tiers[key].toString()))
      return values.filter((value) => value.gt(BigNumber.from(0)))
    },
  }
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

export const askMiStore = createAskMiStore()
export const web3Store = createWeb3Store()
export const leaderboard = createLeaderboard()
export const userInputs = createUserInputs()
export const erc20Store = createERC20Store()

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
