import { erc20Store } from '$lib/stores/erc20'
import { askMi, erc20, provider } from '$lib/stores/other'
import { web3Store } from '$lib/stores/web3'
import { BigNumber, constants, Contract } from 'ethers'
import { get } from 'svelte/store'
import { abi as erc20ABI } from '$lib/abi/MyToken.json'
import type { ERC20 } from '$lib/abi-types/erc20'

export async function setAllowance() {
  erc20Store.setAllowance(
    await get(erc20).allowance(get(web3Store)['signer'], get(askMi).address)
  )
}

export async function setBalanceOf() {
  erc20Store.setBalanceOf(await get(erc20).balanceOf(get(web3Store)['signer']))
}

export async function approve() {
  const totalSupply = await get(erc20).totalSupply()
  await get(erc20).approve(get(askMi).address, totalSupply)

  get(erc20).once(
    'Approval',
    async (owner: string, spender: string, value: BigNumber) => {
      console.log(owner, spender, value.toString())
      erc20Store.setAllowance(value)
    }
  )
}

export async function getTokenNames() {
  let supportedTokens = await get(askMi).supportedTokens()

  let tokenNames: { [key: string]: string } = {}

  supportedTokens.forEach(async (token) => {
    if (token === constants.AddressZero) {
      tokenNames[token] = 'Ethereum'
    } else {
      let erc20 = new Contract(
        token,
        erc20ABI,
        get(provider).getSigner()
      ) as ERC20
      tokenNames[token] = await erc20.name()
    }
  })

  return tokenNames
}

export async function getTokenNamesWithTipToken() {
  let supportedTokens = await get(askMi).supportedTokens()
  let [token] = await get(askMi)._tip()

  let tokenNames: { [key: string]: string } = {}
  let tokens = Array.from(new Set([...supportedTokens, token]))

  tokens.forEach(async (token) => {
    if (token === constants.AddressZero) {
      tokenNames[token] = 'Ethereum'
    } else {
      let erc20 = new Contract(
        token,
        erc20ABI,
        get(provider).getSigner()
      ) as ERC20
      tokenNames[token] = await erc20.name()
    }
  })

  return tokenNames
}
