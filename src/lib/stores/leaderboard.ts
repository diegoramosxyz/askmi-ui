import { writable } from 'svelte/store'

export type Leaderboard = {
  contract: string
  owner: string
  answeredCount: number
}[]

function createLeaderboard() {
  const { subscribe, set } = writable<Leaderboard>([])

  return { subscribe, set }
}

export const leaderboard = createLeaderboard()
