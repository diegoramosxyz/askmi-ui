import { ethers, Contract, BigNumber, utils } from 'ethers'
import type { AskMi, ERC20 } from './askmi'
import {
  approved,
  askMiAddress,
  askMiFactory,
  askMiFactory_ERC20,
  askMi_ERC20,
  decimals,
  erc20,
  factoryTiers,
  factoryTip,
  leaderboard,
  loading,
  pendingTx,
  questions,
  signer,
  symbol,
  textAreaContent,
  tiersUpdated,
  tip,
  tipUpdated,
} from './store'
import { get } from 'svelte/store'
import { abi as erc20ABI } from '$lib/abi/MyToken.json'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { abi as askMiAbi_ERC20 } from '$lib/abi/AskMi_ERC20.json'
import { abi as askMiFactoryAbi_ERC20 } from '$lib/abi/AskMiFactory_ERC20.json'
import { provider, askMi, owner, tiers, chainId } from './store'
import { getQuestionsSubset } from './eventListeners'
import type { AskMiFactory } from './askmi-factory'
import { detectAccountsChanged, detectChainChanged } from './MetaMask'
import { getBytes32FromMultiash } from '$lib/utils/cid'
import makeBlockie from 'ethereum-blockies-base64'
import { goto } from '$app/navigation'

function setProvider() {
  // Get the provider from the browser
  provider.set(new ethers.providers.Web3Provider(window.ethereum))
}

async function setChainId() {
  const _chainId = await window.ethereum.request({ method: 'eth_chainId' })
  if (_chainId !== '0x3') {
    // alert('This contract has only been deployed to the Ropsten Testnet.')
  }
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

  // Check that user has approved spending
  approved.set(approvedAmount.gt(BigNumber.from(0)))
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
    detectAccountsChanged()
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

async function fetchTextToIPFS() {
  const formData = new FormData()
  formData.append('question', get(textAreaContent))

  const res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData,
  })
  const { Hash } = await res.json()
  return Hash
}

export async function ask(_tierIndex: number) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  let { hash, wait } = await get(askMi_ERC20).ask(
    digest,
    hashFunction,
    size,
    BigNumber.from(_tierIndex),
    {
      value: utils.parseEther(get(tiers)[_tierIndex]),
    }
  )

  // Update questions when event has been emitted
  get(askMi_ERC20).once(
    'QuestionAsked',
    async (_questioner: string, _exchangeIndex: BigNumber) => {
      await getQuestionsSubset()
    }
  )

  pendingTx.set(hash)
  // Reset input field
  textAreaContent.set('')
  await wait()
  pendingTx.set(null)
}

export async function respond(questioner: string, qIndex: ethers.BigNumber) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  let { hash, wait } = await get(askMi_ERC20).respond(
    questioner,
    digest,
    hashFunction,
    size,
    qIndex
  )

  // Update questions when event has been emitted
  get(askMi_ERC20).once(
    'QuestionAnswered',
    async (_questioner: string, _exchangeIndex: BigNumber) => {
      await getQuestionsSubset()
    }
  )

  pendingTx.set(hash)
  // Reset input field
  textAreaContent.set('')
  await wait()
  pendingTx.set(null)
}

export async function removeQuestion(
  questioner: string,
  exchangeIndex: BigNumber
) {
  await get(askMi_ERC20).removeQuestion(questioner, exchangeIndex)

  // Do not wait for event
  // Optimistically update state for better UX
  questions.set(
    get(questions).map((obj) => {
      if (obj.questioner === questioner) {
        // Delete the element from the exchanges array
        // before the transaction is completed for better UX
        obj.questions.splice(exchangeIndex.toNumber(), 1)
        return obj
      }
      return obj
    })
  )

  get(askMi_ERC20).once(
    'QuestionRemoved',
    async (_questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
  await get(askMi_ERC20).issueTip(questioner, exchangeIndex, {
    value: await get(askMi_ERC20).tip(),
  })

  // Do not wait for event
  // Optimistically update state for better UX
  questions.set(
    get(questions).map((obj) => {
      if (obj.questioner === questioner) {
        // Increment tips by one
        obj.questions[exchangeIndex.toNumber()].tips = BigNumber.from(
          obj.questions[exchangeIndex.toNumber()].tips.toNumber() + 1
        )
        return obj
      }
      return obj
    })
  )

  get(askMi_ERC20).once(
    'TipIssued',
    async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function updateTiers() {
  let _tiers = get(factoryTiers)
    .filter(({ value }) => value > 0)
    .map(({ value }) => utils.parseEther(value.toString()))
  await get(askMi_ERC20).updateTiers(_tiers)
  // Do not wait for event
  // Optimistically update state for better UX
  tiersUpdated.set(true)
  get(askMi_ERC20).once('TiersUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}

export async function updateTip() {
  let _tip = utils.parseEther(get(factoryTip).toString())
  await get(askMi_ERC20).updateTip(_tip)
  // Do not wait for event
  // Optimistically update state for better UX
  tipUpdated.set(true)
  get(askMi_ERC20).once('TipUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}

export function instantiateAskMi() {
  if (!!decimals) {
    let _tiers = get(factoryTiers)
      .filter(({ value }) => value > 0)
      .map(({ value }) => utils.parseUnits(value.toString(), get(decimals)))
    let _tip = utils.parseUnits(get(factoryTip).toString(), get(decimals))
    // Deploy an AskMi instance
    get(askMiFactory_ERC20).instantiateAskMi(_tiers, _tip)
    // Listen to the AskMiInstantiated event
    get(askMiFactory_ERC20).once(
      'AskMiInstantiated',
      (_askMiAddress: string) => {
        // Redirect user to the newly create AskMi instance
        goto(`/instance/${_askMiAddress}`)
      }
    )
  }
}

export function getBlockie(address: string | undefined) {
  if (address) {
    return makeBlockie(address)
  }
  // TODO: add fallback img
  return ''
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
