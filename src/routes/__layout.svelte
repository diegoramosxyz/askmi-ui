<script>
  import Banner from '$lib/components/Banner.svelte'
  import Navbar from '$lib/components/Navbar.svelte'
  import Pending from '$lib/components/Pending.svelte'
  import '../app.postcss'
</script>

<Banner />
<main class="px-3 lg:px-0 max-w-screen-md mx-auto">
  <Pending />
  <Navbar />
  <slot />
</main>
