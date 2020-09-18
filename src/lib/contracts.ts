import {
  BNXTOKEN_ADDRESS_LIST,
  MASTER_ADDRESS_LIST,
  MULTICALL_ADDRESS_LIST,
  WBNB_ADDRESS_LIST,
  FACTORY_ADDRESS_LIST,
  ROUTER_ADDRESS_LIST,
  BnEXRouterJson,
  BnEXFactoryJson,
  BNXTokenJson,
  MasterJson,
  MultiCallJson,
  WBNBJson,
  ChainId
} from './constants'

import { Contract } from '@ethersproject/contracts'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

export class Contracts {
  bnx: Contract
  master: Contract
  wbnb: Contract
  multicall: Contract
  factory: Contract
  router: Contract

  constructor(provider: Web3Provider | JsonRpcSigner, networkId: ChainId) {
    this.bnx = new Contract(BNXTOKEN_ADDRESS_LIST[networkId], BNXTokenJson.abi, provider as any)
    this.master = new Contract(MASTER_ADDRESS_LIST[networkId], MasterJson.abi, provider as any)
    this.multicall = new Contract(MULTICALL_ADDRESS_LIST[networkId], MultiCallJson.abi, provider as any)
    this.wbnb = new Contract(WBNB_ADDRESS_LIST[networkId], WBNBJson.abi, provider as any)
    this.factory = new Contract(FACTORY_ADDRESS_LIST[networkId], BnEXFactoryJson.abi, provider as any)
    this.router = new Contract(ROUTER_ADDRESS_LIST[networkId], BnEXRouterJson.abi, provider as any)
  }
}
