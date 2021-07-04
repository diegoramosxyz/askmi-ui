import type { ethers } from 'ethers'
import type { dQandA } from './contract'
import type { questionsByQuestioner } from './store'
import type { Writable } from 'svelte/store'
import { getMultihashFromBytes32 } from '../utils/cid'

// Ethers docs
// https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber

// https://docs.ethers.io/v5/api/contract/contract/#Contract-on

export async function updateQuestions(
  contract: dQandA,
  questioners: Writable<string[]>,
  questions: Writable<questionsByQuestioner>
) {
  // Get questioners and remove the first element of the array
  // The first element is the 0 address
  let qrs = (await contract.getQuestioners()).slice(1)
  questioners.set(qrs)
  let _questioners: string[] = []
  questioners.subscribe((value) => (_questioners = value))

  let qs: questionsByQuestioner = []
  // WARNING TODO: Limit the amount of questioners queried
  // Create a Questions object for each questioner
  _questioners.map(async (questioner) => {
    let _questions = await contract.getQuestions(questioner)
    // Call the ipfs endpoint for each cid stored in the contract
    // Todo: Limit the amount of call made at once
    let _questionsWithText = await Promise.all(
      _questions.map(async (qAndA) => {
        let q = getMultihashFromBytes32(qAndA.question)
        let a = getMultihashFromBytes32(qAndA.answer)
        let resolvedQuestion = null
        let resolvedAnswer = null
        if (q !== null) {
          let res = await fetch(`https://ipfs.io/ipfs/${q}`)
          resolvedQuestion = await res.text()
        }
        if (a !== null) {
          let res = await fetch(`https://ipfs.io/ipfs/${a}`)
          resolvedAnswer = await res.text()
        }
        return {
          ...qAndA,
          resolvedQuestion,
          resolvedAnswer,
        }
      })
    )

    qs.push({
      questioner: questioner.toLocaleLowerCase(),
      questions: _questionsWithText,
    })
    // Research why this is the only way to make this work
    questions.set(qs)
  })
}

// This function will only run once on page load
export async function InitializeContractEventListeners(
  contract: dQandA,
  questioners: Writable<string[]>,
  questions: Writable<questionsByQuestioner>
) {
  // Update data on page load
  await updateQuestions(contract, questioners, questions)

  // Update data on events
  contract.on(
    'QuestionAsked',
    async (_questioner: string, _qIndex: ethers.BigNumber) =>
      await updateQuestions(contract, questioners, questions)
  )
  contract.on(
    'QuestionAnswered',
    async (_questioner: string, _qIndex: ethers.BigNumber) =>
      await updateQuestions(contract, questioners, questions)
  )
  contract.on(
    'QuestionRemoved',
    async (_questioner: string, _qIndex: ethers.BigNumber) =>
      await updateQuestions(contract, questioners, questions)
  )
}
