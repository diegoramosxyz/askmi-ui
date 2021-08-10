import { BigNumber, constants, utils } from 'ethers'
import { writable } from 'svelte/store'

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

export const userInputs = createUserInputs()
