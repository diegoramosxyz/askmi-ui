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
   * Variables
   */
  owner(): Promise<string>
  tip(): Promise<BigNumber>
  fee(): Promise<BigNumber>

  /**
   * Functions
   */
  updateTip(_newTipPrice: BigNumber): Promise<Transaction>
  updateTiers(_newTiers: BigNumber[]): Promise<Transaction>
  getTiers(): Promise<BigNumber[]>
  getQuestioners(): Promise<string[]>
  getQuestions(_questioner: string): Promise<Exchange[]>
  ask(
    _digest: string,
    _hashFunction: BigNumber,
    _size: BigNumber,
    _tierIndex: BigNumber,
    overrides: CallOverrides
  ): Promise<Transaction>
  removeQuestion(_exchangeIndex: BigNumber): Promise<Transaction>
  respond(
    _questioner: string,
    _digest: string,
    _hashFunction: BigNumber,
    _size: BigNumber,
    _exchangeIndex: BigNumber
  ): Promise<Transaction>
  issueTip(_questioner: string, _exchangeIndex: BigNumber): Promise<Transaction>
}
