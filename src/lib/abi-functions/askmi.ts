import { getBytes32FromMultiash } from '$lib/utils/cid'
import { getQuestionsSubset } from '$lib/web3/loadExchanges'
import {
  functionsContract,
  askMi,
  userInputs,
  web3Store,
  askMiStore,
} from '$lib/web3/store'
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

  try {
    await tx.wait()
    await getQuestionsSubset()
  } catch (error) {
    console.log(error)
  }
  web3Store.pendingTx(tx.hash)
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
  try {
    await wait()
    await getQuestionsSubset()
  } catch (error) {
    console.log(error)
  }
  web3Store.pendingTx(hash)
}

export async function removeQuestion(
  questioner: string,
  exchangeIndex: BigNumber
) {
  await get(askMi).removeQuestion(questioner, exchangeIndex)

  // Do not wait for event
  // Optimistically update state for better UX

  askMiStore.removeOneExchange(questioner, exchangeIndex.toNumber())
}

export async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
  await get(askMi).issueTip(
    get(functionsContract),
    questioner,
    exchangeIndex
    //    {
    //   value: await get(askMi).tip(),
    // }
  )

  askMiStore.plusOneTips(questioner, exchangeIndex.toNumber())

  // get(askMi).once(
  //   'TipIssued',
  //   async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
  //     await getQuestionsSubset()
  // )
}

export async function updateTiers(token: string) {
  let tiers = userInputs.tiersAsArray(get(userInputs)['tiers'])

  await get(askMi).updateTiers(get(functionsContract), token, tiers)
  // Do not wait for event
  // Optimistically update state for better UX
  // tiersUpdated.set(true)
  // get(askMi).once('TiersUpdated', (_askMiAddress: string) => {
  //   location.reload()
  // })
}

export async function updateTip(token: string) {
  let tip = BigNumber.from(get(userInputs)['tip'])
  await get(askMi).updateTip(get(functionsContract), tip, token)
  // Do not wait for event
  // Optimistically update state for better UX
  // tipUpdated.set(true)
  // get(askMi).once('TipUpdated', (_askMiAddress: string) => {
  //   location.reload()
  // })
}
