import { ethers, Contract } from 'ethers'
import type { dQandA } from './contract'
import { signer } from './store'
import { abi } from '../ABI/Dqanda.json'
import {
  provider,
  contract,
  owner,
  price,
  questioners,
  questions,
} from '../web3/store'
import { InitializeContractEventListeners } from './eventListeners'

// Get the ETH balance for any account in human-readable form
export async function getRoundedEthBalance(
  provider: ethers.providers.Web3Provider,
  address: string
) {
  // return the balance formated to ETH
  let ETH = ethers.utils.formatEther(await provider?.getBalance(address))
  return Math.floor(Number(ETH) * 100) / 100
}

function getProviderAndContract(
  contractAddress: string,
  contractABI: ethers.ContractInterface
) {
  // Get the provider from the browser
  const _provider = new ethers.providers.Web3Provider(window.ethereum)

  // Create a new Contract instance for the Multi Sig Wallet
  let _contract = new Contract(
    contractAddress || '',
    contractABI,
    _provider.getSigner()
  ) as dQandA

  return { _provider, _contract }
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
export async function setUpWeb3(
  contractAddress: string | boolean | undefined,
  chainId: string | boolean | undefined
) {
  // Check that the environment variables are loaded
  if (typeof contractAddress == 'string' && typeof chainId == 'string') {
    // Get the web3 provider (MetaMask) and the contract object
    const { _provider, _contract } = getProviderAndContract(
      contractAddress,
      abi
    )

    // Set check to update data on events
    setMetaMaskChecks(_provider)
    setChainChecks(chainId, _provider)
    InitializeContractEventListeners(_contract, questioners, questions)

    // Load stores
    provider.set(_provider)
    contract.set(_contract)
    owner.set((await _contract.owner()).toLocaleLowerCase())
    price.set(ethers.utils.formatEther(await _contract.price()))
  } else {
    console.log('Enviroment variables not loaded.')
  }
}
