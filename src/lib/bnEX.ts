import { BigNumber } from '@ethersproject/bignumber'
import { Contracts } from './contracts.js'
import { EVM } from './evm.js'

import { ChainId, BigintIsh } from './constants'
import { JsonRpcSigner, Web3Provider } from '@ethersproject/providers'

export class BnEX {
  testing: EVM | undefined
  contracts: Contracts
  wethAddress: any
  snapshot: Promise<any> | undefined
  operation: any
  chainId: ChainId
  account: string
  provider: Web3Provider | JsonRpcSigner

  constructor(
    provider: Web3Provider | JsonRpcSigner,
    chainId: ChainId,
    account: string,
    testing: EVM | undefined | null
  ) {
    if (testing) {
      this.testing = new EVM(provider)
      this.snapshot = this.testing.snapshot()
    }
    this.account = account
    this.chainId = chainId
    this.provider = provider
    this.contracts = new Contracts(provider, chainId)
  }

  async resetEVM() {
    this.testing?.resetEVM(await this.snapshot)
  }

  toBigN(a: BigintIsh) {
    return BigNumber.from(a)
  }
}
