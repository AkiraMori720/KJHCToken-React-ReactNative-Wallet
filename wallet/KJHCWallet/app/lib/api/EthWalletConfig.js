import {ETH_NETWORKS} from '../../constants/coin';

export default class EthWalletConfig {
  network = null
  infuraKey = null
  chainID = null

  constructor(network, infuraKey) {
    this.network = network
    this.infuraKey = infuraKey

    this.chainID = this.getChainID(network)
  }

  getChainID(name) {
    switch (name) {
      case ETH_NETWORKS.MAIN_NET: return 1
      case ETH_NETWORKS.ROPSTEN: return 3
      case ETH_NETWORKS.RINKEBY: return 4
      case ETH_NETWORKS.KOVAN: return 42
      default: throw new Error('Unsupported network')
    }
  }

  getRPCURL() {
    switch (this.chainID) {
      case 1: return `https://mainnet.infura.io/${this.infuraKey}`
      case 3: return `https://ropsten.infura.io/${this.infuraKey}`
      case 4: return `https://rinkeby.infura.io/${this.infuraKey}`
      case 42: return `https://kovan.infura.io/${this.infuraKey}`
      default: throw new Error('Unsupport network')
    }
  }

  getWSSURL() {
    switch (this.chainID) {
      case 1: return `wss://mainnet.infura.io/ws/${this.infuraKey}`
      case 3: return `wss://ropsten.infura.io/ws/${this.infuraKey}`
      case 4: return `wss://rinkeby.infura.io/ws/${this.infuraKey}`
      case 42: return `wss://kovan.infura.io/ws/${this.infuraKey}`
      default: throw new Error('Unsupport network')
    }
  }

  toJSON() {
    return { network: this.network, infuraKey: this.infuraKey, chainID: this.chainID }
  }
}
