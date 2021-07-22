<script>
  import { leaderboard } from '$lib/web3/store'
  import Blockie from './Blockie.svelte'
</script>

<article class="max-w-prose grid justify-center">
  <div>
    <header>
      <h2 class="mb-3 text-xl text-center">Leaderboard</h2>
    </header>
    {#if !!$leaderboard && $leaderboard.length > 0}
      <table class="table-auto rounded">
        <thead class="border-b-2 border-trueGray-800">
          <tr>
            <th class="px-3 py-1 text-sm">Questions<br />Answered</th>
            <th class="px-3 py-1 text-sm">Responder</th>
          </tr>
        </thead>
        <tbody>
          {#each $leaderboard as { contract, owner, answeredCount }, i}
            <tr class={i % 2 === 0 ? '' : 'bg-trueGray-800'}>
              <td class="px-3 py-1.5 text-center">{answeredCount}</td>
              <td class="px-3 py-1.5"
                ><a
                  class="no-underline hover:underline"
                  href={`/instance/${contract}`}><Blockie address={owner} /></a
                ></td
              >
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>
</article>
