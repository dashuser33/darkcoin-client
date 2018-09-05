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

// Masternodes

export interface MasterNode {
  /**
   * the masternode IP address
   */
  readonly address: string;
  /**
   * the masternode public key address
   */
  readonly payee: string;
  /**
   * the status of the masternode
   */
  readonly status: string;
  /**
   * the protocol version number of the masternode
   */
  readonly protocol: number;
  /**
   * the daemon version of the masternode (sometimes is 'UNKNOWN')
   */
  readonly daemonversion: string;
  /**
   * the version of sentinel running on the masternode
   */
  readonly sentinelversion: string;
  /**
   * the sentinel state of the masternode
   */
  readonly sentinelstate: string;
  /**
   * the epoch time for when the node was last seen by our node
   */
  readonly lastseen: string;
  /**
   * time time in seconds since the node was first seen
   */
  readonly activeseconds: string;
  /**
   * the epoch time for when the node was last paid
   */
  readonly lastpaidtime: string;
  /**
   * the block height at which the node was last paid
   */
  readonly lastpaidblock: string;
}

export interface MasterNodeList {
  /**
   * the key/value dictionary of masternodes
   */
  [key:string]: MasterNode
}

// Gobjects

export interface GObject {
  /**
   * the hex representation of this gobject
   */
  readonly DataHex: string;
  /**
   * the psuedo JSON representation of the gobject
   */
  readonly DataString: string;
  /**
   * the hash of the governance object
   */
  readonly Hash: string;
  /**
   * the hash of the collateral used to submit the proposal
   */
  readonly CollateralHash: string;
  /**
   * type is either 1: Unknown, 2: Proposals, 3: Trigger, 4: Watchdog
   */
  readonly ObjectType: number;
  /**
   * epoch timestamp in seconds for the creation time of the proposal
   */
  readonly CreationTime: number;
  /**
   * the current valid absolute vote count for this proposal (yes votes - no votes)
   */
  readonly AbsoluteYesCount: number;
  /**
   * the current count of valid yes votes for this proposal
   */
  readonly YesCount: number;
  /**
   * the current count of valid no votes for this proposal
   */
  readonly NoCount: number;
  /**
   * the current count of valid abstain votes for this proposal
   */
  readonly AbstainCount: number;
  /**
   * not really used
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
}

export interface GObjectList {
  /**
   * the key/value dictionary of gobjects
   */
  [key:string]: GObject
}

export interface GObjectVote {
  /**
   * vote_hash, vinMasternode, time, outcome, and signal of the vote.
   * Seperator used is ':'
   */
  vote_info: string;
}

export interface GObjectCurrentVotesList {
  /**
   * An array of votes
   */
  [key:string]: GObjectVote;
}