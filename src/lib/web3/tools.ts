import { ethers, Contract, BigNumber, utils } from 'ethers'
import type { AskMi } from './askmi'
import {
  askMiAddress,
  askMiFactory,
  factoryTiers,
  factoryTip,
  loading,
  pendingTx,
  questions,
  signer,
  textAreaContent,
  tiersUpdated,
  tip,
  tipUpdated,
} from './store'
import { get } from 'svelte/store'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
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

// Set up event listeners and load store with initial data
export async function setUpAskMi(
  address: string,
  chainId: ImportMetaEnv[''],
  questioner?: string | null
) {
  // Check that the environment variables are loaded
  if (typeof chainId == 'string') {
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

    await setOwner()
    await setTiers()
    await setTip()

    await getQuestionsSubset(questioner)

    loading.set(false)
  } else {
    console.log('Enviroment variables not loaded.')
  }
}

// Set up event listeners and load store with initial data
export async function setUpAskMiFactory(
  address: ImportMetaEnv[''],
  chainId: ImportMetaEnv['']
) {
  // Check that the environment variables are loaded
  if (typeof address == 'string' && typeof chainId == 'string') {
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

    // Check if the current signer has created an AskMi contract
    await setAskMiAddress()

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
  let { hash, wait } = await get(askMi).ask(
    digest,
    hashFunction,
    size,
    BigNumber.from(_tierIndex),
    {
      value: utils.parseEther(get(tiers)[_tierIndex]),
    }
  )

  // Update questions when event has been emitted
  get(askMi).once(
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
  let { hash, wait } = await get(askMi).respond(
    questioner,
    digest,
    hashFunction,
    size,
    qIndex
  )

  // Update questions when event has been emitted
  get(askMi).once(
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
  await get(askMi).removeQuestion(questioner, exchangeIndex)

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

  get(askMi).once(
    'QuestionRemoved',
    async (_questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
  await get(askMi).issueTip(questioner, exchangeIndex, {
    value: await get(askMi).tip(),
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

  get(askMi).once(
    'TipIssued',
    async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function updateTiers() {
  let _tiers = get(factoryTiers)
    .filter(({ value }) => value > 0)
    .map(({ value }) => utils.parseEther(value.toString()))
  await get(askMi).updateTiers(_tiers)
  // Do not wait for event
  // Optimistically update state for better UX
  tiersUpdated.set(true)
  get(askMi).once('TiersUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}

export async function updateTip() {
  let _tip = utils.parseEther(get(factoryTip).toString())
  await get(askMi).updateTip(_tip)
  // Do not wait for event
  // Optimistically update state for better UX
  tipUpdated.set(true)
  get(askMi).once('TipUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}

export function instantiateAskMi() {
  let _tiers = get(factoryTiers)
    .filter(({ value }) => value > 0)
    .map(({ value }) => utils.parseEther(value.toString()))
  let _tip = utils.parseEther(get(factoryTip).toString())
  // Deploy an AskMi instance
  get(askMiFactory).instantiateAskMi(_tiers, _tip)
  // Listen to the AskMiInstantiated event
  get(askMiFactory).once('AskMiInstantiated', (_askMiAddress: string) => {
    // Redirect user to the newly create AskMi instance
    goto(`/instance/${_askMiAddress}`)
  })
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
