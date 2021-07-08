import type { AskMi } from './askmi'
import type { questionsByQuestioner } from './store'
import type { Writable } from 'svelte/store'
import { getMultihashFromBytes32 as getCid } from '$lib/utils/cid'
import { get } from 'svelte/store'

// Ethers docs
// https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber

// https://docs.ethers.io/v5/api/contract/contract/#Contract-on

async function resolveIpfs(cid: string | null) {
  if (cid !== null) {
    let res = await fetch(`https://ipfs.io/ipfs/${cid}`)
    return await res.text()
  }
  return null
}

export async function getQuestionsSubset(
  contract: AskMi,
  questioners: Writable<string[]>,
  questions: Writable<questionsByQuestioner>
) {
  // 1- Get questioners
  // 2- remove the first element of the array (which is the 0 address)
  // 3- Remove all other questioners, but the last 5
  // This is done to limit the FETCH resquest made to IPFS
  questioners.set((await contract.getQuestioners()).slice(1).slice(-5))
  // Initialize the questions array
  questions.set([])

  // Fetch data from IPFS
  get(questioners).map(async (questioner) => {
    // Get only the last 3 questions asked by the questioner
    // This is done to limit the amount request made by the browser to IPFS
    let _questions = (await contract.getQuestions(questioner)).slice(-3)

    // Get the data from IPFS using the CID for questions and answers
    let _fetchedContent = await Promise.all(
      _questions.map(async (qAndA) => {
        return {
          ...qAndA,
          resolvedQuestion: await resolveIpfs(getCid(qAndA.question)),
          resolvedAnswer: await resolveIpfs(getCid(qAndA.answer)),
        }
      })
    )

    // Push the new elements into the questions array
    questions.set([
      ...get(questions),
      {
        questioner: questioner.toLocaleLowerCase(),
        questions: _fetchedContent,
      },
    ])
  })
}
