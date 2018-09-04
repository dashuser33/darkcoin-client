type booleanString = "true" | "false";

export interface WalletInfo {
  /**
   * the wallet version
   */
  readonly walletversion: number;
  /**
   * the total confirmed balance of the wallet in DASH
   */
  readonly balance: number;
  /**
   * the anonymized dash balance of the wallet in DASH
   */
  readonly privatesend_balance: number;
  /**
   * the total unconfirmed balance of the wallet in DASH
   */
  readonly unconfirmed_balance: number;
  /**
   * the total immature balance of the wallet in DASH
   */
  readonly immature_balance: number;
  /**
   * the total number of transactions in the wallet
   */
  readonly txcount: number;
  /**
   * the timestamp (seconds since Unix epoch) of the oldest pre-generated key in the key pool
   */
  readonly keypoololdest: number;
  /**
   * how many new keys are pre-generated (only counts external keys)
   */
  readonly keypoolsize: number;
  /**
   * how many new keys are pre-generated for internal use (used for change outputs, only appears if the wallet is using this feature, otherwise external keys are used)
   */
  readonly keypoolsize_hd_internal?: number;
  /**
   * how many new keys are left since last automatic backup
   */
  readonly keys_left: number;
  /**
   * the transaction fee configuration, set in DASH/kB
   */
  readonly paytxfee: number;
}

export interface MasterNode {
  readonly address: string;
  /**
   * the masternode IP address
   */
  readonly payee: string;
  /**
   * the masternode public key address
   */
  readonly status: string;
  /**
   * the status of the masternode
   */
  readonly protocol: number;
  /**
   * the protocol version number of the masternode
   */
  readonly daemonversion: string;
  /**
   * the daemon version of the masternode (sometimes is 'UNKNOWN')
   */
  readonly sentinelversion: string;
  /**
   * the sentinel version of the masternode
   */
  readonly sentinelstate: string;
  /**
   * the sentinel state of the masternode
   */
  readonly lastseen: string;
  /**
   * the epoch time for when the node was last seen by our node
   */
  readonly activeseconds: string;
  /**
   * time time in seconds since the node was first seen
   */
  readonly lastpaidtime: string;
  /**
   * the epoch time for when the node was last paid
   */
  readonly lastpaidblock: string;
  /**
   * the block height at which the node was last paid
   */
}

// Masternode Stuff

export interface MasterNodeList {
  /**
   * the key/value dictionary of masternodes
   */
  [key:string]: MasterNode
}

// Gobject Stuff

export interface GObject {
  readonly DataHex: string;
  /**
   * the hex representation of this gobject
   */
  readonly DataString: string;
  /**
   * the psuedo JSON representation of the gobject
   */
  readonly Hash: string;
  /**
   * the hash of the governance object
   */
  readonly CollateralHash: string;
  /**
   * the hash of the collateral used to submit the proposal
   */
  readonly ObjectType: number;
  /**
   * type is either 1: funding, 2: trigger, 3:?
   */
  readonly CreationTime: number;
  /**
   * epoch timestamp in seconds for the creation time of the proposal
   */
  readonly AbsoluteYesCount: number;
  /**
   * the current valid absolute vote count for this proposal (yes votes - no votes)
   */
  readonly YesCount: number;
  /**
   * the current count of valid yes votes for this proposal
   */
  readonly NoCount: number;
  /**
   * the current count of valid no votes for this proposal
   */
  readonly AbstainCount: number;
  /**
   * the current count of valid abstain votes for this proposal
   */
  readonly fBlockchainValidity: booleanString;
  /**
   * not really used
   */
  readonly IsValidReason: string;
  /**
   * not really used
   */
  readonly fCachedValid: string;
  /**
   * not really used
   */
  readonly fCachedFunding: booleanString;
  /**
   * not really used
   */
  readonly fCachedDelete: booleanString;
  /**
   * not really used
   */
  readonly fCachedEndorsed: booleanString;
  /**
   * not really used
   */
}

export interface GObjectList {
  /**
   * the key/value dictionary of gobjects
   */
  [key:string]: GObject
}