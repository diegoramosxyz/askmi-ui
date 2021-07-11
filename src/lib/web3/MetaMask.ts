/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider'
import { get } from 'svelte/store'
import type { Writable } from 'svelte/store'
import { askMiFactory, myAskMi } from './store'

export async function detectProvider() {
  // this returns the provider, or null if it wasn't detected
  const provider = await detectEthereumProvider()

  if (provider) {
    startApp(provider) // Initialize your app
  } else {
    console.log('Please install MetaMask!')
  }

  function startApp(provider: unknown) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?')
    }
    // Access the decentralized web!
  }
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/

export async function detectChain(chainId: Writable<string | null>) {
  chainId.set(await window.ethereum.request({ method: 'eth_chainId' }))

  window.ethereum.on('chainChanged', (chainId: string) => {
    // window.location.reload()
    console.log(`Network changed to: ${chainId}`)
  })
}

/***********************************************************/
/* Handle user accounts and accountsChanged (per EIP-1193) */
/***********************************************************/

export function detectAccountsChanged(
  signer: Writable<string>,
  customCallback: () => Promise<void>
) {
  // Note that this event is emitted on page load.
  // If the array of accounts is non-empty, you're already
  // connected.
  window.ethereum.on('accountsChanged', () =>
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(async (accounts: string[]) => {
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          signer.set('')
          console.log('Please connect to MetaMask.')
        } else if (accounts[0] !== get(signer)) {
          signer.set(accounts[0])
          // Add any custom logic to update UI
          await customCallback()
        }
      })
      .catch((err: Error) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err)
      })
  )
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.

// While you are awaiting the call to eth_requestAccounts, you should disable
// any buttons the user can click to initiate the request.
// MetaMask will reject any additional requests while the first is still
// pending.

export function connectToMetaMask(signer: Writable<string>) {
  window.ethereum
    .request({ method: 'eth_requestAccounts' })
    .then((accounts: string[]) => {
      if (accounts.length === 0) {
        // MetaMask is locked or the user has not connected any accounts
        signer.set('')
        console.log('Please connect to MetaMask.')
      } else {
        signer.set(accounts[0])
      }
    })
    .catch((err: any) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.')
      } else {
        console.error(err)
      }
    })
}