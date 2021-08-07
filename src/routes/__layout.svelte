<script>
  import Banner from '$lib/components/Banner.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import { askMiStore, userInputs, web3Store } from '$lib/web3/store'
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
