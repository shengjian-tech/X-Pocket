import { solanaNetwork } from "./network"
export const netListData = [
  {
    chain: 'xuper',
    netName: 'XuperOS',
    node: 'https://xuper.baidu.com/nodeapi',
    type: 'xuper',
    sign: 'xuper',
  },
  {
    chain: 'eth',
    netName: 'Polygon-Testnet',
    node: 'https://rpc-mumbai.maticvigil.com',
    type: 'eth',
    chainid: 80001,
    sign: 'polygon',
  },
  {
    chain: 'eth',
    netName: 'Ethereum',
    node: 'https://eth.llamarpc.com',
    type: 'eth',
    chainid: 1,
    sign: 'eth',
  },
  {
    chain: "solana",
    netName: "Solana",
    node: solanaNetwork,
    type: "solana",
    sign: "solana"
  }
]

export const chainListData = [
  {
    id: 1,
    name: 'Ethereum',
    value: 'eth',
    sign: 'eth',
  },
  {
    id: 2,
    name: 'XuperOS',
    value: 'xuper',
    sign: 'xuper',
  },
  {
    id: 3,
    name: 'Solana',
    value: 'solana',
    sign: 'solana',
  },
]