import { askMi, questioners, questions } from './store'
import { get } from 'svelte/store'

// Ethers docs
// https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber

// https://docs.ethers.io/v5/api/contract/contract/#Contract-on

export async function resolveIpfs(cid: string | null) {
  if (!!cid) {
    const res = await fetch(`https://ipfs.io/ipfs/${cid}`)
    const text = await res.text()
    if (res.ok) {
      return text
    } else {
      throw new Error(text)
    }
  }
  return null
}

export async function getQuestionsSubset() {
  // 1- Get questioners
  // 2- remove the first element of the array (which is the 0 address)
  // 3- Remove all other questioners, but the last 5
  // This is done to limit the FETCH resquest made to IPFS
  questioners.set((await get(askMi).getQuestioners()).slice(1).slice(-5))
  // Initialize the questions array
  questions.set([])

  // Fetch data from IPFS
  get(questioners).map(async (questioner) => {
    // Get only the last 3 questions asked by the questioner
    // This is done to limit the amount request made by the browser to IPFS
    let _questions = (await get(askMi).getQuestions(questioner)).slice(-3)

    // Push the new elements into the questions array
    questions.set([
      ...get(questions),
      {
        questioner,
        questions: _questions,
      },
    ])
  })
}

export async function getAllQuestionsFromQuestioner(address: string) {
  // Check if the query corresponds to an ETH address
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    let _questions = await get(askMi).getQuestions(address)

    // Push the new elements into the questions array
    questions.set([
      {
        questioner: address,
        questions: _questions,
      },
    ])
  }
}
