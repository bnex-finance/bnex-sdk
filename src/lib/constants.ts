import { BigNumber } from '@ethersproject/bignumber'
import { keccak256 } from '@ethersproject/solidity'
import BnEXRouterJson from '../abi/BnEXRouter.json'
import BnEXFactoryJson from '../abi/BnEXFactory.json'
import BNXTokenJson from '../abi/BNXToken.json'
import MasterJson from '../abi/Master.json'
import BnEXPairJson from '../abi/BnEXPair.json'
import MultiCallJson from '../abi/Multicall.json'
import JSBI from 'jsbi'
import WBNBJson from '../abi/WBNB.json'

export { BnEXRouterJson, BnEXFactoryJson, BNXTokenJson, MasterJson, BnEXPairJson, MultiCallJson, WBNBJson }

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

type ChainContractList = {
  readonly [chainId in ChainId]: string
}

// Important Constant
export const FACTORY_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: BnEXFactoryJson.networks[ChainId.MAINNET].address,
  [ChainId.TESTNET]: BnEXFactoryJson.networks[ChainId.TESTNET].address
}

export const ROUTER_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: BnEXRouterJson.networks[ChainId.MAINNET].address,
  [ChainId.TESTNET]: BnEXRouterJson.networks[ChainId.TESTNET].address
}

export const BNXTOKEN_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: BNXTokenJson.networks[ChainId.MAINNET].address,
  [ChainId.TESTNET]: BNXTokenJson.networks[ChainId.TESTNET].address
}

export const MASTER_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: MasterJson.networks[ChainId.MAINNET].address,
  [ChainId.TESTNET]: MasterJson.networks[ChainId.TESTNET].address
}

export const MULTICALL_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: MultiCallJson.networks[ChainId.MAINNET].address,
  [ChainId.TESTNET]: MultiCallJson.networks[ChainId.TESTNET].address
}

export const WBNB_ADDRESS_LIST: ChainContractList = {
  [ChainId.MAINNET]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
  [ChainId.TESTNET]: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd'
}

export const INIT_CODE_HASH = keccak256(['bytes'], [`${BnEXPairJson.bytecode}`])

// exports for internal consumption
export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)
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

const ONE_MINUTE_IN_SECONDS = BigNumber.from(60)
const ONE_HOUR_IN_SECONDS = ONE_MINUTE_IN_SECONDS.mul(60)
const ONE_DAY_IN_SECONDS = ONE_HOUR_IN_SECONDS.mul(24)
const ONE_YEAR_IN_SECONDS = ONE_DAY_IN_SECONDS.mul(365)

export const INTEGERS = {
  ONE_MINUTE_IN_SECONDS,
  ONE_HOUR_IN_SECONDS,
  ONE_DAY_IN_SECONDS,
  ONE_YEAR_IN_SECONDS,
  ZERO: BigNumber.from(0),
  ONE: BigNumber.from(1),
  ONES_31: BigNumber.from('4294967295'), // 2**32-1
  ONES_127: BigNumber.from('340282366920938463463374607431768211455'), // 2**128-1
  ONES_255: BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935'), // 2**256-1
  INTEREST_RATE_BASE: BigNumber.from('10').pow('18')
}
