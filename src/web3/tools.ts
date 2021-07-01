import { ethers, Contract } from 'ethers'
import type { dQandA, Question } from './contract'
import { InitializeContractEventListeners } from './eventListeners'
import { signer } from './store'

// Get the ETH balance for any account in human-readable form
export async function getRoundedEthBalance(
  provider: ethers.providers.Web3Provider,
  address: string
) {
  // return the balance formated to ETH
  let ETH = ethers.utils.formatEther(await provider?.getBalance(address))
  return Math.floor(Number(ETH) * 100) / 100
}

// Convert Big Number types to human readable types
export function formatQuestion(q: Question) {
  return {
    question: {
      digest: q.question.digest,
      hashFunction: q.question.hashFunction.toNumber(),
      size: q.question.size.toNumber(),
    },
    answer: {
      digest: q.answer.digest,
      hashFunction: q.answer.hashFunction.toNumber(),
      size: q.answer.size.toNumber(),
    },
    qIndex: q.qIndex.toNumber(),
    balance: ethers.utils.formatEther(q.balance),
  }
}

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

export function metaMaskChecks(provider: ethers.providers.Web3Provider) {
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

export async function initializeEventListeners(
  chainId: string,
  provider: ethers.providers.Web3Provider,
  contract: dQandA
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

  // Create event listeners
  InitializeContractEventListeners(contract, provider)
}
