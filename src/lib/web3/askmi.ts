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

export type Exchange = {
  question: Cid
  answer: Cid
  exchangeIndex: BigNumber
  balance: BigNumber
  tips: BigNumber
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
  ): Promise<ContractTransaction>
  issueTip(
    _questioner: string,
    _exchangeIndex: BigNumber,
    overrides: CallOverrides
  ): Promise<ContractTransaction>

  /**
   * STATE MODIFIER FUNCTIONS
   */

  removeQuestion(
    _questioner: string,
    _exchangeIndex: BigNumber
  ): Promise<ContractTransaction>
  respond(
    _questioner: string,
    _digest: string,
    _hashFunction: BigNumber,
    _size: BigNumber,
    _exchangeIndex: BigNumber
  ): Promise<ContractTransaction>
  updateTiers(_newTiers: BigNumber[]): Promise<ContractTransaction>
  updateTip(_newTipPrice: BigNumber): Promise<ContractTransaction>

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

export interface ERC20 extends Contract {
  name(): Promise<string>

  symbol(): Promise<string>

  decimals(): Promise<BigNumber>

  totalSupply(): Promise<BigNumber>

  balanceOf(account: string): Promise<BigNumber>

  transfer(recipient: string, amount: BigNumber): Promise<boolean>

  allowance(owner: string, spender: string): Promise<BigNumber>

  approve(spender: string, amount: BigNumber): Promise<boolean>

  transferFrom(
    sender: string,
    recipient: string,
    amount: BigNumber
  ): Promise<boolean>

  increaseAllowance(spender: string, addedValue: BigNumber): Promise<boolean>

  decreaseAllowance(spender: string, addedValue: BigNumber): Promise<boolean>
}
