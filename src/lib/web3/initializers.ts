import { Contract, ethers, utils } from 'ethers'
import { get } from 'svelte/store'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { detectAccountsChanged } from './MetaMask'
import type { AskMiFactory } from '$lib/abi-types/askmi-factory'
import type { AskMi } from '$lib/abi-types/askmi'
import { getMyAskMi } from '$lib/abi-functions/askmi-factory'
import {
  askMiFactory,
  functionsContract,
  loading,
  provider,
} from '$lib/stores/other'
import { populateWeb3Store } from '$lib/stores/web3'
import { askMiStore, populateAskMiStore } from '$lib/stores/askMi'
import { populateErc20Store } from '$lib/stores/erc20'
import { leaderboard } from '$lib/stores/leaderboard'
import { setAllowance, setBalanceOf } from '$lib/abi-functions/erc20'

async function updateERC20() {
  await setBalanceOf()
  await setAllowance()
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

    provider.set(new ethers.providers.Web3Provider(window.ethereum))

    await populateWeb3Store()

    await populateAskMiStore(address)

    let firstToken = get(askMiStore)['_supportedTokens'][0]

    await populateErc20Store(firstToken)

    detectAccountsChanged(updateERC20)

    functionsContract.set(functions)

    // await getQuestionsSubset(questioner)

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

    provider.set(new ethers.providers.Web3Provider(window.ethereum))

    await populateWeb3Store()

    // Instantiate an AskMiFactory contract object
    askMiFactory.set(
      new Contract(
        address,
        askMiFactoryAbi,
        get(provider).getSigner()
      ) as AskMiFactory
    )

    // Check if the current signer has created an AskMi contract
    await getMyAskMi()

    // Detect account changes
    detectAccountsChanged(getMyAskMi)

    functionsContract.set(functions)

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
