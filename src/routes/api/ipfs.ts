import btoa from 'btoa'

let { VITE_INFURA_PROJECT_SECRET, VITE_INFURA_PROJECT_ID } = import.meta.env
let headers = new Headers()

headers.set(
  'Authorization',
  'Basic ' + btoa(VITE_INFURA_PROJECT_ID + ':' + VITE_INFURA_PROJECT_SECRET)
)

export async function post(req: any) {
  console.log(req.body)
  fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: req.body,
    headers,
    mode: 'no-cors',
  }).catch((error) => {
    console.error('Error:', error)
  })
  return {
    body: JSON.stringify(req.body),
  }
}
