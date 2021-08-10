<script>
  import Banner from '$lib/components/Banner.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import { askMiStore } from '$lib/stores/askMi'
  import { erc20Store } from '$lib/stores/erc20'
  import { functionsContract } from '$lib/stores/other'
  import { userInputs } from '$lib/stores/userInputs'
  import { web3Store } from '$lib/stores/web3'
  import '../app.postcss'
</script>

<Banner />
<main class="px-3 lg:px-0 max-w-screen-md mx-auto">
  <Navbar />
  <slot />
</main>
<pre>
  {JSON.stringify($askMiStore, null, 2)}
</pre>
<pre>
  {JSON.stringify($web3Store, null, 2)}
</pre>
<pre>
  {JSON.stringify($userInputs, null, 2)}
</pre>
<pre>
  {JSON.stringify({functionsContract: $functionsContract}, null, 2)}
</pre>
<pre>
  {JSON.stringify($erc20Store, null, 2)}
</pre>
