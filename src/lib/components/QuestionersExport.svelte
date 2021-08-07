<script lang="ts">
  import { askMiStore, web3Store } from '$lib/web3/store'

  function content(arr: any[]) {
    if (!!arr) {
      let questioners = arr.map((obj) => obj.questioner)
      let csvContent = 'data:text/csv;charset=utf-8,' + questioners.join('\n')
      return encodeURI(csvContent)
    }
  }

  $: csvContent2 = content($askMiStore._exchanges[$web3Store.signer])
</script>

<a href={csvContent2} download="questioners.csv">Download questioners.csv </a>
