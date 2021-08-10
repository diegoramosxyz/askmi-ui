import { ethers, Contract, BigNumber, utils, constants } from 'ethers'
import { get } from 'svelte/store'
import { abi as erc20ABI } from '$lib/abi/MyToken.json'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { detectAccountsChanged, detectChainChanged } from './MetaMask'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import { getQuestionsSubset } from './loadExchanges'
import type { AskMi } from '$lib/abi-types/askmi'
import type { ERC20 } from '$lib/abi-types/erc20'
import { getMyAskMi } from '$lib/abi-functions/askmi-factory'
import {
  askMi,
  askMiFactory,
  erc20,
  functionsContract,
  loading,
  provider,
} from '$lib/stores/other'
import { web3Store } from '$lib/stores/web3'
import { askMiStore } from '$lib/stores/askMi'
import { userInputs } from '$lib/stores/userInputs'
import { erc20Store } from '$lib/stores/erc20'
import { leaderboard } from '$lib/stores/leaderboard'

async function setupMetamask() {
  provider.set(new ethers.providers.Web3Provider(window.ethereum))

  const chainId = await window.ethereum.request({ method: 'eth_chainId' })
  web3Store.chainId(chainId)

  const accounts = await get(provider).listAccounts()
  web3Store.signer(accounts[0])

  await detectChainChanged()
}

async function populateAskMiStore() {
  askMiStore._owner(await get(askMi)._owner())
  askMiStore._supportedTokens(await get(askMi).supportedTokens())

  let _token = get(askMiStore)._supportedTokens[0]
  let _tiers = await get(askMi).getTiers(_token)
  askMiStore._tiers({ [_token]: _tiers })

  const [token, tip] = await get(askMi)._tip()
  askMiStore._tip({ tip, token })
  userInputs.tip(+utils.formatUnits(tip))
}

export async function checkApproved() {
  const approvedAmount = await get(erc20).allowance(
    get(web3Store).signer,
    get(askMi).address
  )

  let tiers = get(askMiStore)._tiers[get(askMiStore)['_supportedTokens'][0]]

  // Check that the amount approved is greater than
  // the most expensive tier
  erc20Store.approved(approvedAmount.gt(tiers[tiers.length - 1]))
}

export async function approve() {
  const totalSupply = await get(erc20).totalSupply()
  await get(erc20).approve(get(askMi).address, totalSupply)
  // Approval(address owner, address spender, uint256 value)
  get(erc20).once(
    'Approval',
    async (owner: string, spender: string, value: BigNumber) => {
      erc20Store.approved(true)
    }
  )
}

export async function populateErc20() {
  checkApproved()
  erc20Store.symbol(await get(erc20).symbol())
  erc20Store.decimals(await get(erc20).decimals())
}

// Set up event listeners and load store with initial data
export async function setUpAskMi(
  functions: ImportMetaEnv[''],
  address: string,
  questioner?: string | null
) {
  // Check that the environment variables are loaded
  if (typeof functions == 'string') {
    loading.set(true)

    await setupMetamask()

    askMi.set(
      new Contract(address, askMiAbi, get(provider).getSigner()) as AskMi
    )

    // Detect account changes
    await populateAskMiStore()

    if (get(askMiStore)['_supportedTokens'][0] !== constants.AddressZero) {
      erc20.set(
        new Contract(
          get(askMiStore)['_supportedTokens'][0],
          erc20ABI,
          get(provider).getSigner()
        ) as ERC20
      )
      await populateErc20()
      detectAccountsChanged(checkApproved)
      await checkApproved()
    }

    functionsContract.set(functions)

    await getQuestionsSubset(questioner)

    loading.set(false)
  } else {
    console.log('Enviroment variables not loaded.')
  }
}

// Set up event listeners and load store with initial data
export async function setUpAskMiFactory(
  address: ImportMetaEnv[''],
  functions: ImportMetaEnv[''],
  _erc20: ImportMetaEnv['']
) {
  // Check that the environment variables are loaded
  if (
    typeof address == 'string' &&
    typeof functions == 'string' &&
    typeof _erc20 == 'string'
  ) {
    loading.set(true)

    await setupMetamask()

    // Instantiate an AskMiFactory contract object
    askMiFactory.set(
      new Contract(
        address,
        askMiFactoryAbi,
        get(provider).getSigner()
      ) as AskMiFactory
    )

    erc20.set(
      new Contract(_erc20, erc20ABI, get(provider).getSigner()) as ERC20
    )

    // Detect account changes
    detectAccountsChanged(getMyAskMi)

    functionsContract.set(functions)

    // Check if the current signer has created an AskMi contract
    await getMyAskMi()

    // Get every AskMiInstantiated event emitted by the factory contract
    let events = await get(askMiFactory).queryFilter({
      address,
      topics: [utils.id('AskMiInstantiated(address)')],
    })

    // Get the address for every AskMi instance
    let askMis = events.map((event) => event.args && event.args['askMi'])

    // Initialize leaderboard
    leaderboard.set([])
    async function asyncForEach<T>(
      array: T[],
      callback: (item: T, index: number, allItems: T[]) => void
    ) {
      await Promise.all(array.map(callback))
    }

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

      let owner = await askMi._owner()

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
