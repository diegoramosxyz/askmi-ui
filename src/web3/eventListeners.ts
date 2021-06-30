import type { ethers } from 'ethers'
import type { dQandA } from './contract'

// Ethers docs
// https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber

// https://docs.ethers.io/v5/api/contract/contract/#Contract-on

export function InitializeContractEventListeners(
  contract: dQandA,
  provider: ethers.providers.Web3Provider
) {
  contract.on(
    'QuestionAsked' || 'QuestionAnswered' || 'QuestionRemoved',
    async (_questioner: string, _txIndex: ethers.BigNumber) => {
      console.log('EVENT PUSHED')
      /**
       * UPDATE STORES
       */
    }
  )
}
