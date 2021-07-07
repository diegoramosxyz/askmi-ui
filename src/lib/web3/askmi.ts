import type { BigNumber, Contract, Transaction, CallOverrides } from 'ethers'

export type Cid = {
  digest: string
  hashFunction: BigNumber
  size: BigNumber
}

export type Exchange = {
  question: Cid
  answer: Cid
  exchangeIndex: BigNumber
  balance: BigNumber
  tips: BigNumber
  resolvedQuestion: string | null
  resolvedAnswer: string | null
}

export interface AskMi extends Contract {
  /**
   * PAYABLE FUNCTIONS
   */

  ask(
    _digest: string,
    _hashFunction: BigNumber,
    _size: BigNumber,
    _tierIndex: BigNumber,
    overrides: CallOverrides
  ): Promise<Transaction>
  issueTip(
    _questioner: string,
    _exchangeIndex: BigNumber,
    overrides: CallOverrides
  ): Promise<Transaction>

  /**
   * STATE MODIFIER FUNCTIONS
   */

  removeQuestion(
    _questioner: string,
    _exchangeIndex: BigNumber
  ): Promise<Transaction>
  respond(
    _questioner: string,
    _digest: string,
    _hashFunction: BigNumber,
    _size: BigNumber,
    _exchangeIndex: BigNumber
  ): Promise<Transaction>
  updateTiers(_newTiers: BigNumber[]): Promise<Transaction>
  updateTip(_newTipPrice: BigNumber): Promise<Transaction>

  /**
   * GETTER FUNCTIONS
   */

  getTiers(): Promise<BigNumber[]>
  getQuestioners(): Promise<string[]>
  getQuestions(_questioner: string): Promise<Exchange[]>

  /**
   * VARIABLES
   */

  tip(): Promise<BigNumber>
  fee(): Promise<BigNumber>
  owner(): Promise<string>
}
