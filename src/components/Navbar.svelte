<script>
  import { signer } from '../web3/store'
</script>

<nav class="flex justify-between items-center py-3">
  <section>dQandA</section>
  <button
    class={`px-3 py-2 ring-1 ${
      $signer ? 'ring-amber-600' : 'ring-trueGray-600'
    } rounded`}>MetaMask</button
  >
</nav>
