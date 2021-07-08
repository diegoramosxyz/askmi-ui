import { ethers, Contract } from 'ethers'
import type { AskMi } from './askmi'
import { askMiFactory, myAskMi, signer } from './store'
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

function setMetaMaskChecks(provider: ethers.providers.Web3Provider) {
  if (window.ethereum) {
    // Detect the account on MetaMask upon page reload
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(async (accounts: string[]) =>
        signer.set({
          address: accounts[0],
          balance: await getRoundedEthBalance(provider, accounts[0]),
        })
      )
      .catch((err: Error) => console.error(err))

    // Detect when accounts are changed in MetaMask
    window.ethereum.on('accountsChanged', async (accounts: string[]) =>
      signer.set({
        address: accounts[0],
        balance: await getRoundedEthBalance(provider, accounts[0]),
      })
    )
  } else {
    // Prompt user to install MetaMask
    // Todo: Show pop up error message
    console.log('INSTALL METAMASK TO USE THIS DAPP!')
  }
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
export async function setUpAskMi(
  address: ImportMetaEnv[''],
  chainId: ImportMetaEnv[''],
  path: string
) {
  // Check that the environment variables are loaded
  if (typeof address == 'string' && typeof chainId == 'string') {
    // Get the web3 provider (MetaMask) and the contract object
    const _provider = getProvider()
    const _contract = new Contract(
      address,
      askMiAbi,
      _provider.getSigner()
    ) as AskMi

    // Set check to update data on events
    setMetaMaskChecks(_provider)
    setChainChecks(chainId, _provider)
    if (path.startsWith('/instance/')) {
      // Run once on page load
      await getQuestionsSubset(_contract, questioners, questions)
    }
    let _tiers = await _contract.getTiers()
    let formattedTiers = _tiers.map((tier) => ethers.utils.formatEther(tier))

    // Load stores
    provider.set(_provider)
    askMi.set(_contract)
    owner.set((await _contract.owner()).toLocaleLowerCase())
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
    // Get the web3 provider (MetaMask) and the contract object
    const _provider = getProvider()
    const _contract = new Contract(
      address,
      askMiFactoryAbi,
      _provider.getSigner()
    ) as AskMiFactory

    // Set check to update data on events
    setMetaMaskChecks(_provider)
    setChainChecks(chainId, _provider)

    // Load stores
    provider.set(_provider)
    askMiFactory.set(_contract)

    // _provider.getBalance()

    let _accounts = await _provider.listAccounts()
    myAskMi.set(await _contract.getMyAskMi(_accounts[0]))
  } else {
    console.log('Enviroment variables not loaded.')
  }
}
