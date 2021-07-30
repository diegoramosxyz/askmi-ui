<script>
  import { approve } from '$lib/web3/tools'
  import Button from './Button.svelte'
</script>

<article>
  <p class="mb-2">Approve spending.</p>
  <Button color="lime" click={() => approve()}>Approve</Button>
</article>
