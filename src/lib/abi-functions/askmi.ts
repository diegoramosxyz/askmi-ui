import { askMiStore } from '$lib/stores/askMi'
import { erc20Store } from '$lib/stores/erc20'
import { askMi, erc20, functionsContract } from '$lib/stores/other'
import { userInputs } from '$lib/stores/userInputs'
import { web3Store } from '$lib/stores/web3'
import { getBytes32FromMultiash } from '$lib/utils/cid'
import { getQuestionsSubset } from '$lib/web3/loadExchanges'
import { BigNumber, constants, ContractTransaction } from 'ethers'
import { get } from 'svelte/store'

export async function fetchTextToIPFS() {
  const formData = new FormData()
  formData.append('question', get(userInputs).textArea)

  const res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData,
  })
  const { Hash } = await res.json()
  return Hash
}

export async function ask(token: string, index: number) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  let tx: ContractTransaction
  if (token === constants.AddressZero) {
    tx = await get(askMi).ask(
      get(functionsContract),
      token,
      digest,
      hashFunction,
      size,
      BigNumber.from(index),
      {
        value: get(askMiStore)._tiers[token][index],
      }
    )
  } else {
    tx = await get(askMi).ask(
      get(functionsContract),
      token,
      digest,
      hashFunction,
      size,
      BigNumber.from(index)
    )
  }

  web3Store.pendingTx(tx.hash)
  // Reset input field
  userInputs.textArea('')

  await tx.wait()
  await getQuestionsSubset()

  web3Store.pendingTx(null)
}

export async function respond(questioner: string, qIndex: BigNumber) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  let { hash, wait } = await get(askMi).respond(
    get(functionsContract),
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

  web3Store.pendingTx(hash)
  // Reset input field
  userInputs.textArea('')

  await wait()
  await getQuestionsSubset()

  web3Store.pendingTx(null)
}

export async function remove(questioner: string, exchangeIndex: BigNumber) {
  let { hash, wait } = await get(askMi).remove(
    get(functionsContract),
    questioner,
    exchangeIndex
  )

  web3Store.pendingTx(hash)
  askMiStore.removeOneExchange(questioner, exchangeIndex.toNumber())

  await wait()

  web3Store.pendingTx(null)
}

export async function issueTip(questioner: string, exchangeIndex: BigNumber) {
  let tx: ContractTransaction
  let { token, tip } = get(askMiStore)['_tip']
  if (token === constants.AddressZero) {
    tx = await get(askMi).issueTip(
      get(functionsContract),
      questioner,
      exchangeIndex,
      {
        value: tip,
      }
    )
  } else {
    tx = await get(askMi).issueTip(
      get(functionsContract),
      questioner,
      exchangeIndex
    )
  }

  web3Store.pendingTx(tx.hash)
  askMiStore.plusOneTips(questioner, exchangeIndex.toNumber())

  await tx.wait()

  web3Store.pendingTx(null)
  await getQuestionsSubset()
}

export async function approve() {
  const totalSupply = await get(erc20).totalSupply()
  await get(erc20).approve(get(web3Store)['signer'], totalSupply)

  get(erc20).once(
    'Approval',
    async (owner: string, spender: string, value: BigNumber) => {
      erc20Store.setAllowance(await get(erc20).allowance(owner, spender))
    }
  )
}

export async function updateTiers(token: string) {
  let tiers = userInputs.tiersAsArray(get(userInputs)['tiers'])
  let { hash, wait } = await get(askMi).updateTiers(
    get(functionsContract),
    token,
    tiers
  )

  web3Store.pendingTx(hash)

  await wait()
  location.reload()

  web3Store.pendingTx(null)
}

export async function updateTip(token: string) {
  let tip = BigNumber.from(get(userInputs)['tip'])
  let { hash, wait } = await get(askMi).updateTip(
    get(functionsContract),
    tip,
    token
  )

  web3Store.pendingTx(hash)

  await wait()
  location.reload()

  web3Store.pendingTx(null)
}

export async function updateRemovalFee() {
  let removalFee = BigNumber.from(get(userInputs)['removalFee'])
  let { hash, wait } = await get(askMi).updateRemovalFee(
    get(functionsContract),
    removalFee
  )

  web3Store.pendingTx(hash)

  await wait()
  location.reload()

  web3Store.pendingTx(null)
}
