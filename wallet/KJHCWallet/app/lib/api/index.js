import * as wallet from './wallet'
import {EtherJSONRPC} from './ether-json-rpc'
import * as NotificationAPI from './NotificationAPI'
import * as Transaction from './Transaction'
import * as Token from './Token'
import * as Changelog from './Changelog'

export default {
  ...wallet,
  EtherJSONRPC,
  ...NotificationAPI,
  ...Changelog,
  ...Token,
  ...Transaction
}
