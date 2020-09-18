import { Contracts } from './contracts.js'

export class Account {
  contracts: Contracts
  accountInfo: string
  type: string
  balances: {}
  approvals: {}
  status: string
  allocation: never[]
  walletInfo: {}

  constructor(contracts: Contracts, address: string) {
    this.contracts = contracts
    this.accountInfo = address
    this.type = ''
    this.allocation = []
    this.balances = {}
    this.status = ''
    this.approvals = {}
    this.walletInfo = {}
  }
}
