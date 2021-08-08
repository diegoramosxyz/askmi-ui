import type {
  BigNumber,
  Contract,
  CallOverrides,
  ContractTransaction,
} from 'ethers'

export type Cid = {
  digest: string
  hashFunction: BigNumber
  size: BigNumber
}

export type Tip = {
  token: string
  tip: BigNumber
}

export type Fees = {
  removal: BigNumber
  developer: BigNumber
}

export type Exchange = {
  question: Cid
  answer: Cid
  token: string
  index: BigNumber
  balance: BigNumber
  tips: BigNumber
}

export interface AskMi extends Contract {
  /**
   * PAYABLE FUNCTIONS
   */

  ask(
    functionsContract: string,
    token: string,
    digest: string,
    hashFunction: BigNumber,
    size: BigNumber,
    index: BigNumber,
    overrides?: CallOverrides
  ): Promise<ContractTransaction>

  issueTip(
    functionsContract: string,
    questioner: string,
    index: BigNumber,
    overrides?: CallOverrides
  ): Promise<ContractTransaction>

  /**
   * STATE MODIFIER FUNCTIONS
   */

  remove(
    functionsContract: string,
    questioner: string,
    index: BigNumber
  ): Promise<ContractTransaction>

  respond(
    functionsContract: string,
    questioner: string,
    digest: string,
    hashFunction: BigNumber,
    size: BigNumber,
    index: BigNumber
  ): Promise<ContractTransaction>

  toggleDisabled(functionsContract: string): Promise<ContractTransaction>

  updateTiers(
    functionsContract: string,
    token: string,
    tiers: BigNumber[]
  ): Promise<ContractTransaction>

  updateTip(
    functionsContract: string,
    tip: BigNumber,
    token: string
  ): Promise<ContractTransaction>

  /**
   * GETTER FUNCTIONS
   */

  _disabled(): Promise<boolean>
  _fees(): Promise<Fees>
  _owner(): Promise<string>
  _tip(): Promise<[string, BigNumber]>
  getTiers(token: string): Promise<BigNumber[]>
  questioners(): Promise<string[]>
  questions(_questioner: string): Promise<Exchange[]>
  supportedTokens(): Promise<string[]>
}
