export function shrinkAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}
