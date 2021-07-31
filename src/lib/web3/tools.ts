import { ethers, Contract, BigNumber, utils } from 'ethers'
import {
  approved,
  askMiAddress,
  askMiFactory,
  askMiFactory_ERC20,
  askMi_ERC20,
  decimals,
  erc20,
  leaderboard,
  loading,
  signer,
  symbol,
  tip,
} from './store'
import { get } from 'svelte/store'
import { abi as erc20ABI } from '$lib/abi/MyToken.json'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { abi as askMiAbi_ERC20 } from '$lib/abi/AskMi_ERC20.json'
import { abi as askMiFactoryAbi_ERC20 } from '$lib/abi/AskMiFactory_ERC20.json'
import { provider, askMi, owner, tiers, chainId } from './store'
import { detectAccountsChanged, detectChainChanged } from './MetaMask'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import { getQuestionsSubset } from './loadExchanges'
import type { AskMi } from '$lib/abi-types/askmi'
import type { ERC20 } from '$lib/abi-types/erc20'

function setProvider() {
  // Get the provider from the browser
  provider.set(new ethers.providers.Web3Provider(window.ethereum))
}

async function setChainId() {
  const _chainId = await window.ethereum.request({ method: 'eth_chainId' })
  chainId.set(_chainId)
}

async function setSigner() {
  const accounts = await get(provider).listAccounts()
  signer.set(accounts[0])
}

async function setOwner() {
  const _owner = await get(askMi).owner()
  owner.set(_owner)
}

async function setTiers() {
  let _tiers = await get(askMi).getTiers()
  let formattedTiers = _tiers.map((tier) => ethers.utils.formatEther(tier))
  tiers.set(formattedTiers)
}

async function setTip() {
  const _tip = await get(askMi).tip()
  tip.set(_tip.toString())
}

async function setAskMiAddress() {
  try {
    askMiAddress.set(await get(askMiFactory).getMyAskMi(get(signer)))
  } catch (error) {
    askMiAddress.set(null)
  }
}

async function checkApproved() {
  const approvedAmount = await get(erc20).allowance(
    get(signer),
    get(askMi).address
  )

  let _tiers = await get(askMi).getTiers()

  // Check that the amount approved is greater than
  // the most expensive tier
  approved.set(approvedAmount.gt(_tiers[_tiers.length - 1]))
}

export async function approve() {
  const totalSupply = await get(erc20).totalSupply()
  await get(erc20).approve(get(askMi).address, totalSupply)
  // Approval(address owner, address spender, uint256 value)
  get(erc20).once(
    'Approval',
    async (owner: string, spender: string, value: BigNumber) => {
      approved.set(true)
    }
  )
}

async function getSymbol() {
  symbol.set(await get(erc20).symbol())
}

async function getDecimals() {
  decimals.set(await get(erc20).decimals())
}

// Set up event listeners and load store with initial data
export async function setUpAskMi(
  address: string,
  chainId: ImportMetaEnv[''],
  _erc20: ImportMetaEnv[''],
  questioner?: string | null
) {
  // Check that the environment variables are loaded
  if (typeof chainId == 'string' && typeof _erc20 == 'string') {
    loading.set(true)
    // Get the web3 provider (MetaMask) and the contract object
    setProvider()
    // Set the signer on page load
    await setSigner()
    // Detect account changes
    detectAccountsChanged(checkApproved)
    // Set the Chain ID
    await setChainId()
    // Detect chain id changes
    await detectChainChanged()

    askMi.set(
      new Contract(address, askMiAbi, get(provider).getSigner()) as AskMi
    )

    askMi_ERC20.set(
      new Contract(address, askMiAbi_ERC20, get(provider).getSigner()) as AskMi
    )

    await setOwner()
    await setTiers()
    await setTip()

    erc20.set(
      new Contract(_erc20, erc20ABI, get(provider).getSigner()) as ERC20
    )

    await checkApproved()

    await getQuestionsSubset(questioner)

    await getSymbol()
    await getDecimals()

    loading.set(false)
  } else {
    console.log('Enviroment variables not loaded.')
  }
}

// Set up event listeners and load store with initial data
export async function setUpAskMiFactory(
  address: ImportMetaEnv[''],
  chainId: ImportMetaEnv[''],
  _erc20: ImportMetaEnv['']
) {
  // Check that the environment variables are loaded
  if (
    typeof address == 'string' &&
    typeof chainId == 'string' &&
    typeof _erc20 == 'string'
  ) {
    loading.set(true)
    // Get the web3 provider (MetaMask) and the contract object
    setProvider()
    // Set the signer on page load
    await setSigner()
    // Detect account changes
    detectAccountsChanged(setAskMiAddress)
    // Set the Chain ID
    await setChainId()
    // Detect chain id changes
    await detectChainChanged()

    // Instantiate an AskMiFactory contract object
    askMiFactory.set(
      new Contract(
        address,
        askMiFactoryAbi,
        get(provider).getSigner()
      ) as AskMiFactory
    )

    askMiFactory_ERC20.set(
      new Contract(
        address,
        askMiFactoryAbi_ERC20,
        get(provider).getSigner()
      ) as AskMiFactory
    )

    erc20.set(
      new Contract(_erc20, erc20ABI, get(provider).getSigner()) as ERC20
    )

    await getSymbol()
    await getDecimals()

    // Check if the current signer has created an AskMi contract
    await setAskMiAddress()

    // Get every AskMiInstantiated event emitted by the factory contract
    let events = await get(askMiFactory).queryFilter({
      address,
      topics: [utils.id('AskMiInstantiated(address)')],
    })

    // Get the address for every AskMi instance
    let askMis = events.map(
      (event) => event.args && event.args['_askMiAddress']
    )

    // Initialize leaderboard
    leaderboard.set([])
    async function asyncForEach<T>(
      array: T[],
      callback: (item: T, index: number, allItems: T[]) => void
    ) {
      await Promise.all(array.map(callback))
    }

    // async function asyncForEach(
    //   array: any[],
    //   callback: (value: any, index?: number, array?: any[]) => any
    // ): Promise<void> {
    //   for (let index = 0; index < array.length; index++) {
    //     await callback(array[index], index, array)
    //   }
    // }

    await asyncForEach(askMis, async (address) => {
      let askMi = new Contract(
        address,
        askMiAbi,
        get(provider).getSigner()
      ) as AskMi

      // Get every QuestionAnswered event emitted by this contract
      let events = await askMi.queryFilter({
        topics: [utils.id('QuestionAnswered(address,uint256)')],
      })

      let owner = await askMi.owner()

      // Push a new element into the leaderboard
      leaderboard.set([
        ...get(leaderboard),
        {
          contract: address,
          owner,
          answeredCount: events.length,
        },
      ])
    })

    // Sort descending by the number of questions answered
    let sortedLeaderboard = get(leaderboard).sort(
      (a, b) => b.answeredCount - a.answeredCount
    )

    leaderboard.set(sortedLeaderboard)

    loading.set(false)
  } else {
    console.log('Enviroment variables not loaded.')
  }
}

// Get the ETH balance for any account in human-readable form
// export async function getRoundedEthBalance(
//   provider: ethers.providers.Web3Provider,
//   address: string
// ) {
//   // return the balance formated to ETH
//   let ETH = ethers.utils.formatEther(await provider?.getBalance(address))
//   return Math.floor(Number(ETH) * 100) / 100
// }
