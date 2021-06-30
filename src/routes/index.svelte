<script lang="ts">
  import { getBytes32FromMultiash, getMultihashFromBytes32 } from '../utils/cid'
  let cid = ''
  function handlesubmit() {
    let bytes32
    let multihash
    bytes32 = getBytes32FromMultiash(cid)
    console.log({ bytes32 })
    multihash = getMultihashFromBytes32(bytes32)
    console.log({ multihash })
  }
</script>

<main class="max-w-prose mx-auto my-3">
  <form class="grid justify-center" on:submit|preventDefault={handlesubmit}>
    <input
      bind:value={cid}
      class="px-3 py-1 ring-1 rounded ring-gray-800"
      placeholder="CID"
    />
  </form>
  <p>QmagCD7i57KJHQV7APbX1WPpBNFUqwV9TYSAVPwqps5W49</p>
</main>
