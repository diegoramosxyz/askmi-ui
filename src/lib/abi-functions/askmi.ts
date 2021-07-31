import { getBytes32FromMultiash } from '$lib/utils/cid'
import { getQuestionsSubset } from '$lib/web3/loadExchanges'
import {
  askMi_ERC20,
  factoryTiers,
  factoryTip,
  pendingTx,
  questions,
  textAreaContent,
  tiers,
  tiersUpdated,
  tipUpdated,
} from '$lib/web3/store'
import { BigNumber, utils } from 'ethers'
import { get } from 'svelte/store'

export async function fetchTextToIPFS() {
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
  let { hash, wait } = await get(askMi_ERC20).ask(
    digest,
    hashFunction,
    size,
    BigNumber.from(_tierIndex)
    // {
    //   value: utils.parseEther(get(tiers)[_tierIndex]),
    // }
  )

  // Update questions when event has been emitted
  get(askMi_ERC20).once(
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

export async function respond(questioner: string, qIndex: BigNumber) {
  const cid = await fetchTextToIPFS()
  // Conver CID into a multihash object
  let { digest, hashFunction, size } = getBytes32FromMultiash(cid)
  // Call the ask function
  let { hash, wait } = await get(askMi_ERC20).respond(
    questioner,
    digest,
    hashFunction,
    size,
    qIndex
  )

  // Update questions when event has been emitted
  get(askMi_ERC20).once(
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
  await get(askMi_ERC20).removeQuestion(questioner, exchangeIndex)

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

  get(askMi_ERC20).once(
    'QuestionRemoved',
    async (_questioner: string, _exchangeIndex: BigNumber) =>
      await getQuestionsSubset()
  )
}

export async function tipAsnwer(questioner: string, exchangeIndex: BigNumber) {
  await get(askMi_ERC20).issueTip(
    questioner,
    exchangeIndex
    //    {
    //   value: await get(askMi_ERC20).tip(),
    // }
  )

  // TODO: DEBUG THIS
  // Do not wait for event
  // Optimistically update state for better UX
  questions.set(
    get(questions).map((obj) => {
      if (obj.questioner === questioner) {
        let selected = obj.questions[exchangeIndex.toNumber()]

        obj.questions[exchangeIndex.toNumber()] = {
          ...selected,
          tips: BigNumber.from(selected.tips.toNumber() + 1),
        }
        // Increment tips by one
        return obj
      }
      return obj
    })
  )

  // get(askMi_ERC20).once(
  //   'TipIssued',
  //   async (_tipper: string, _questioner: string, _exchangeIndex: BigNumber) =>
  //     await getQuestionsSubset()
  // )
}

export async function updateTiers() {
  let _tiers = get(factoryTiers)
    .filter(({ value }) => value > 0)
    .map(({ value }) => utils.parseEther(value.toString()))
  await get(askMi_ERC20).updateTiers(_tiers)
  // Do not wait for event
  // Optimistically update state for better UX
  tiersUpdated.set(true)
  get(askMi_ERC20).once('TiersUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}

export async function updateTip() {
  let _tip = utils.parseEther(get(factoryTip).toString())
  await get(askMi_ERC20).updateTip(_tip)
  // Do not wait for event
  // Optimistically update state for better UX
  tipUpdated.set(true)
  get(askMi_ERC20).once('TipUpdated', (_askMiAddress: string) => {
    location.reload()
  })
}
