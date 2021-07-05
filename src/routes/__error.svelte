<script context="module" lang="ts">
  import type { LoadOutput } from '@sveltejs/kit'

  export function load({ error, status }: LoadOutput) {
    return {
      props: {
        error,
        status,
      },
    }
  }
</script>

<script lang="ts">
  export let error: string | Error | undefined
  export let status: number | undefined
</script>

{#if error && typeof error !== 'string'}
  <h1>{error.name} {status}</h1>
  <h1>{error.message}</h1>
{:else}
  <p>Something went wrong.</p>
{/if}
