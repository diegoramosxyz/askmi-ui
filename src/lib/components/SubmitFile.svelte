<script lang="ts">
  let files: FileList
  let document: any = null
  const formData = new FormData()

  async function upload() {
    var arrBuffers = await files[0].arrayBuffer()
    let buffer = new Uint8Array(arrBuffers)

    // Generate a link to render an image from a buffer
    document = URL.createObjectURL(new Blob([buffer], { type: 'image/png' }))
    formData.append('document', document)

    let res = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData,
    })
    const { Hash } = await res.json()
    return Hash
  }
</script>

<form
  class="my-4 grid gap-3 justify-center"
  on:submit|preventDefault={async () => console.log(await upload())}
>
  <input bind:files type="file" />
  <div>
    <button class="px-4 py-1 font-medium bg-blue-800 text-white rounded"
      >Submit</button
    >
  </div>
  <!-- Render an image submitted by the user -->
  {#if document}
    <img src={document} alt="Svelte logo" />
  {/if}
</form>
