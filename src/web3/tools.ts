import { ethers, Contract } from 'ethers'
import type { dQandA } from './contract'
import { InitializeContractEventListeners } from './eventListeners'
import { signer } from './store'

export function getProviderAndContract(
  contractAddress: string,
  contractABI: ethers.ContractInterface
) {
  // Get the provider from the browser
  const provider = new ethers.providers.Web3Provider(window.ethereum)

  // Create a new Contract instance for the Multi Sig Wallet
  let contract = new Contract(
    contractAddress || '',
    contractABI,
    provider.getSigner()
  ) as dQandA

  return { provider, contract }
}

export function metaMaskChecks() {
  if (window.ethereum) {
    // Detect the account on MetaMask upon page reload
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(async (accounts: string[]) => signer.set(accounts[0]))
      .catch((err: Error) => console.error(err))

    // Detect when accounts are changed in MetaMask
    window.ethereum.on('accountsChanged', async (accounts: string[]) => {
      /**
       * INSERT FUNCTION TO UPDATE STORES
       */
    })
  } else {
    // Prompt user to install MetaMask
    // Todo: Show pop up error message
    console.log('INSTALL METAMASK TO USE THIS DAPP!')
  }
}

export async function initializeEventListeners(
  NETWORK_ID: string,
  provider: ethers.providers.Web3Provider,
  contract: dQandA
) {
  // Listen for chain id changes
  provider.on('network', (newNetwork, oldNetwork) => {
    // Only allow a certain chain
    if (newNetwork.chainId !== +NETWORK_ID) {
      alert(`You must use network ID: ${NETWORK_ID}`)
    }
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    oldNetwork && window.location.reload()
  })

  // Create event listeners
  InitializeContractEventListeners(contract, provider)
}
