import type { BigNumber, Contract } from 'ethers'

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
