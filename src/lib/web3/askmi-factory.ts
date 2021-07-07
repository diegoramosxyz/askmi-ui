import type { BigNumber, Contract } from 'ethers'

export interface AskMi extends Contract {
  /**
   * FUNCTIONS
   */
  getMyAskMi(_owner: string): Promise<string>
  instantiateAskMi(_tiers: BigNumber[], _tip: BigNumber): Promise<string>
}