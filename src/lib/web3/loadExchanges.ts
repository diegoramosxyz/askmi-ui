import { askMi, askMiStore } from './store'
import { get } from 'svelte/store'

// Ethers docs
// https://docs.ethers.io/v5/api/utils/bignumber/#BigNumber

// https://docs.ethers.io/v5/api/contract/contract/#Contract-on

export async function getQuestionsSubset(questioner?: string | null) {
  if (!!questioner) {
    getAllQuestionsFromQuestioner(questioner)
  } else {
    // 1- Get questioners
    // 2- remove the first element of the array (which is the 0 address)
    // 3- Remove all other questioners, but the last 5
    // This is done to limit the FETCH resquest made to IPFS
    askMiStore.sliceQuestioners(await get(askMi).questioners())

    // Fetch data from IPFS
    get(askMiStore)._questioners.map(async (questioner) => {
      // Get only the last 3 questions asked by the questioner
      // This is done to limit the amount request made by the browser to IPFS
      let questions = (await get(askMi).questions(questioner)).slice(-3)

      // Push the new elements into the questions array
      askMiStore.updateOneExchange(questioner, questions)
    })
  }
}

async function getAllQuestionsFromQuestioner(address: string) {
  // Check if the query corresponds to an ETH address
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    let questions = await get(askMi).questions(address)

    // Push the new elements into the questions array
    askMiStore.updateOneExchange(address, questions)
  }
}
