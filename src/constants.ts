import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 56,
  TESTNET = 97
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

type ChainRouterList = {
  readonly [chainId in ChainId]: string
}
// Important Constant
export const FACTORY_ADDRESS_LIST: ChainRouterList = {
  [ChainId.MAINNET]: '0xEA0895b95802Adc49Ff9e97a04dca477fcf5a818',
  [ChainId.TESTNET]: '0xec95460391bE646DDE7dCa3170bfB539F75a2ebe'
}

// Important Constants
// export const FACTORY_ADDRESS = '0xFA7e1dC7cabF93d2dd572d176C5AD77Cb4241937'
export const INIT_CODE_HASH = '0x31e8e8e69e2ed176069c7446ec4d87fffdce2b3302ab06df79a0f2a6f36a9c73' //?wut

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}
