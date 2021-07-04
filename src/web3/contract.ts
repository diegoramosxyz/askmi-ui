import type { ethers } from 'ethers'

export type Cid = {
  digest: string
  hashFunction: ethers.BigNumber
  size: ethers.BigNumber
}

export type Question = {
  question: Cid
  answer: Cid
  qIndex: ethers.BigNumber
  balance: ethers.BigNumber
  resolvedQuestion: string | null
  resolvedAnswer: string | null
}

export interface dQandA extends ethers.Contract {
  /**
   * Variables
   */
  owner(): Promise<string>
  price(): Promise<ethers.BigNumber>

  /**
   * Functions
   */
  getQuestions(address: string): Promise<Question[]>
  getQuestioners(): Promise<string[]>
  ask(
    _digest: string,
    _hashFunction: ethers.BigNumber,
    _size: ethers.BigNumber,
    overrides: ethers.CallOverrides
  ): Promise<ethers.Transaction>
  removeQuestion(_qIndex: ethers.BigNumber): Promise<ethers.Transaction>
  respond(
    _questioner: string,
    _digest: string,
    _hashFunction: ethers.BigNumber,
    _size: ethers.BigNumber,
    _qIndex: ethers.BigNumber
  ): Promise<ethers.Transaction>
}
