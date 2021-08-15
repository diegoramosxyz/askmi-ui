import type { AskMi, Exchange, Fees, Tip } from '$lib/abi-types/askmi'
import { BigNumber, constants, Contract } from 'ethers'
import { derived, get, Readable, writable } from 'svelte/store'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { askMi, provider } from './other'
import { web3Store } from './web3'

const bigZero = BigNumber.from(0)

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

function createAskMiStore() {
  const { subscribe, update, set } = writable<AskMiStore>({
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
    set,
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
          [questioner]: [...data._exchanges[questioner]].splice(index, 1, {
            ...data._exchanges[questioner][index],
            tips: BigNumber.from(
              data._exchanges[questioner][index].tips.toNumber() + 1
            ),
          }),
        },
      })),
    removeOneExchange: (questioner: string, index: number) =>
      update((data) => {
        let exchanges = [...data._exchanges[questioner]]
        exchanges.splice(index, 1)
        data._exchanges[questioner] = exchanges
        return data
      }),
    isQuestionerCheck: (questioner: string) => {
      let signer = get(web3Store)['signer']
      return questioner.toLowerCase() === signer.toLowerCase()
    },
  }
}

export const askMiStore = createAskMiStore()

export const derivedValues: Readable<{ isOwner: boolean }> = derived(
  [askMiStore, web3Store],
  ([$askMiStore, $web3Store]) => ({
    isOwner: $askMiStore._owner.toLowerCase() === $web3Store.signer,
  })
)

export async function populateAskMiStore(contractAddress: string) {
  askMi.set(
    new Contract(contractAddress, askMiAbi, get(provider).getSigner()) as AskMi
  )

  let tip = await get(askMi)._tip()

  let questioners = [...(await get(askMi).questioners())]
  questioners.splice(0, 1)
  // Remove the first questioner which is used for lookups
  let exchanges: AskMiStore['_exchanges'] = {}
  questioners.forEach(async (questioner) => {
    exchanges[questioner] = await get(askMi).questions(questioner)
  })

  let supportedTokens = await get(askMi).supportedTokens()
  let tiers: AskMiStore['_tiers'] = {}
  supportedTokens.forEach(async (token) => {
    tiers[token] = await get(askMi).getTiers(token)
  })

  askMiStore.set({
    address: get(askMi).address,
    _owner: await get(askMi)._owner(),
    _disabled: await get(askMi)._disabled(),
    _tip: {
      token: tip[0],
      tip: tip[1],
    },
    _fees: await get(askMi)._fees(),
    _questioners: questioners,
    _exchanges: exchanges,
    _supportedTokens: supportedTokens,
    _tiers: tiers,
  })
}
