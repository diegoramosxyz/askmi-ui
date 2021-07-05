<script context="module" lang="ts">
  import type { LoadInput } from '@sveltejs/kit'

  export function load({ page }: LoadInput) {
    const { address } = page.params
    return {
      props: {
        address,
      },
    }
  }
</script>

<script lang="ts">
  export let address: string
</script>

{address}
