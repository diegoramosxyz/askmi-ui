import { ethers, Contract } from 'ethers'
import type { AskMi } from './askmi'
import { askMiFactory, loading, myAskMi, signer } from './store'
import { abi as askMiAbi } from '$lib/abi/AskMi.json'
import { abi as askMiFactoryAbi } from '$lib/abi/AskMiFactory.json'
import { provider, askMi, owner, tiers, questioners, questions } from './store'
import { getQuestionsSubset } from './eventListeners'
import type { AskMiFactory } from './askmi-factory'

// Get the ETH balance for any account in human-readable form
export async function getRoundedEthBalance(
  provider: ethers.providers.Web3Provider,
  address: string
) {
  // return the balance formated to ETH
  let ETH = ethers.utils.formatEther(await provider?.getBalance(address))
  return Math.floor(Number(ETH) * 100) / 100
}

function getProvider() {
  // Get the provider from the browser
  return new ethers.providers.Web3Provider(window.ethereum)
}

async function setChainChecks(
  chainId: string,
  provider: ethers.providers.Web3Provider
) {
  // Listen for chain id changes
  provider.on('network', (newNetwork, oldNetwork) => {
    // Only allow a certain chain
    if (newNetwork.chainId !== +chainId) {
      alert(`You must use network ID: ${chainId}`)
    }
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    oldNetwork && window.location.reload()
  })
}

// Set up event listeners and load store with initial data
export async function setUpAskMi(address: string, chainId: ImportMetaEnv['']) {
  // Check that the environment variables are loaded
  if (typeof chainId == 'string') {
    // Get the web3 provider (MetaMask) and the contract object
    const _provider = getProvider()
    const _askMi = new Contract(
      address,
      askMiAbi,
      _provider.getSigner()
    ) as AskMi

    if (window.ethereum) {
      let _accounts = await _provider.listAccounts()
      signer.set({
        address: _accounts[0],
        balance: await getRoundedEthBalance(_provider, _accounts[0]),
      })
      // Detect when accounts are changed in MetaMask
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        signer.set({
          address: accounts[0],
          balance: await getRoundedEthBalance(_provider, accounts[0]),
        })
      })
    } else {
      // Prompt user to install MetaMask
      // Todo: Show pop up error message
      console.log('INSTALL METAMASK TO USE THIS DAPP!')
    }
    setChainChecks(chainId, _provider)
    // Run once on page load
    await getQuestionsSubset(_askMi, questioners, questions)

    let _tiers = await _askMi.getTiers()
    let formattedTiers = _tiers.map((tier) => ethers.utils.formatEther(tier))

    // Load stores
    provider.set(_provider)
    askMi.set(_askMi)
    owner.set(await _askMi.owner())
    tiers.set(formattedTiers)
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
    const _provider = getProvider()
    const _askMiFactory = new Contract(
      address,
      askMiFactoryAbi,
      _provider.getSigner()
    ) as AskMiFactory

    // Set check to update data on events
    if (window.ethereum) {
      let _accounts = await _provider.listAccounts()
      signer.set({
        address: _accounts[0],
        balance: await getRoundedEthBalance(_provider, _accounts[0]),
      })
      // Detect when accounts are changed in MetaMask
      window.ethereum.on('accountsChanged', async (accounts: string[]) => {
        signer.set({
          address: accounts[0],
          balance: await getRoundedEthBalance(_provider, accounts[0]),
        })
        try {
          myAskMi.set(await _askMiFactory.getMyAskMi(accounts[0]))
        } catch (error) {
          myAskMi.set(null)
        }
      })
    } else {
      // Prompt user to install MetaMask
      // Todo: Show pop up error message
      console.log('INSTALL METAMASK TO USE THIS DAPP!')
    }
    setChainChecks(chainId, _provider)

    // Load stores
    provider.set(_provider)
    askMiFactory.set(_askMiFactory)

    let _accounts = await _provider.listAccounts()
    myAskMi.set(await _askMiFactory.getMyAskMi(_accounts[0]))

    loading.set(false)
  } else {
    console.log('Enviroment variables not loaded.')
  }
}
