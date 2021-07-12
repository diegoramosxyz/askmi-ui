import { ethers, Contract, BigNumber, utils } from 'ethers'
import type { AskMi } from './askmi'
import {
  askMiAddress,
  askMiFactory,
  loading,
  signer,
  textAreaContent,
  tip,
} from './store'
import { get } from 'svelte/store'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { provider, askMi, owner, tiers, chainId } from './store'
import { getQuestionsSubset } from './eventListeners'
import type { AskMiFactory } from './askmi-factory'
import { detectAccountsChanged, detectChainChanged } from './MetaMask'
import { getBytes32FromMultiash } from '$lib/utils/cid'

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

  // Load stores
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
    console.log('This address does not have an AskMi instance.')
  }
}

// Set up event listeners and load store with initial data
export async function setUpAskMi(address: string, chainId: ImportMetaEnv['']) {
  // Check that the environment variables are loaded
  if (typeof chainId == 'string') {
    loading.set(true)
    // Get the web3 provider (MetaMask) and the contract object
    setProvider()
    // Set the signer on page load
    setSigner()
    // Detect account changes
    detectAccountsChanged()
    // Set the Chain ID
    setChainId()
    // Detect chain id changes
    detectChainChanged()

    askMi.set(
      new Contract(address, askMiAbi, get(provider).getSigner()) as AskMi
    )

    setOwner()
    setTiers()
    setTip()

    getQuestionsSubset()

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
    setSigner()
    // Detect account changes
    detectAccountsChanged(setAskMiAddress)
    // Set the Chain ID
    setChainId()
    // Detect chain id changes
    detectChainChanged()

    // Instantiate an AskMiFactory contract object
    askMiFactory.set(
      new Contract(
        address,
        askMiFactoryAbi,
        get(provider).getSigner()
      ) as AskMiFactory
    )

    // Check if the current signer has created an AskMi contract
    setAskMiAddress()

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
  get(askMi).ask(digest, hashFunction, size, BigNumber.from(_tierIndex), {
    value: utils.parseEther(get(tiers)[_tierIndex]),
  })
  // Update questions when event has been emitted
  get(askMi).once(
    'QuestionAsked',
    async (_questioner: string, _exchangeIndex: BigNumber) => {
      textAreaContent.set('')
      await getQuestionsSubset()
    }
  )
}

export async function respond(questioner: string, qIndex: ethers.BigNumber) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  get(askMi).respond(questioner, digest, hashFunction, size, qIndex)

  get(askMi).once(
    'QuestionAnswered',
    async (_questioner: string, _exchangeIndex: BigNumber) => {
      textAreaContent.set('')
      await getQuestionsSubset()
    }
  )
}

export async function removeQuestion(
  questioner: string,
  exchangeIndex: BigNumber
) {
  get(askMi).removeQuestion(questioner, exchangeIndex)

  get(askMi).once(
    'QuestionRemoved',
    async (_questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
  get(askMi).issueTip(questioner, exchangeIndex, {
    value: await get(askMi).tip(),
  })

  get(askMi).once(
    'TipIssued',
    async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
      console.log('Tip issued!')
  )
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
