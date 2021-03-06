import type { BigNumber, Contract, ContractTransaction } from 'ethers'

export interface AskMiFactory extends Contract {
  getMyAskMi(owner: string): Promise<string>

  instantiateAskMi(
    tiersToken: string,
    tipToken: string,
    tiers: BigNumber[],
    tip: BigNumber,
    removalFee: BigNumber
  ): Promise<ContractTransaction>
}
