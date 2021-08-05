import type { BigNumber, Contract } from 'ethers'

export interface AskMiFactory extends Contract {
  getMyAskMi(owner: string): Promise<string>

  instantiateAskMi(
    functionsContract: string,
    tiersToken: string,
    tipToken: string,
    tiers: BigNumber[],
    tip: BigNumber,
    removalFee: BigNumber
  ): Promise<string>
}
