import makeBlockie from 'ethereum-blockies-base64'

export function shrinkAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

export function getBlockie(address: string | undefined) {
  if (address) {
    return makeBlockie(address)
  }
  // TODO: add fallback img
  return ''
}
