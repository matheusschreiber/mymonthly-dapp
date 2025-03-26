import { http, createConfig, injected } from 'wagmi'
import { hardhat, mainnet, sepolia } from 'wagmi/chains'


export const config = createConfig({
  chains: [mainnet, sepolia, hardhat],
  connectors: [
    injected(),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [hardhat.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
