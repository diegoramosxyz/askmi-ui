<script>
  import Navbar from '$lib/components/Navbar.svelte'
  import '../app.postcss'
</script>

<main class="px-3 lg:px-0 max-w-screen-md mx-auto">
  <Navbar />
  <slot />
</main>
