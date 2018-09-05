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

// Network Information

export interface Network {
  /**
   * The name of the network. Either ipv4, ipv6, or onion
   */
  readonly name: string;
  /**
   * Set to true if only connections to this network are allowed according to the -onlynet Dash Core command-line/configuration-file parameter. Otherwise set to false
   */
  readonly limited: booleanString;
  /**
   * Set to true if connections can be made to or from this network. Otherwise set to false
   */
  readonly reachable: booleanString;
  /**
   * The hostname and port of any proxy being used for this network. If a proxy is not in use, an empty string
   */
  readonly proxy: string;
  /**
   * Added in Bitcoin Core 0.11.0
   * Set to true if randomized credentials are set for this proxy. Otherwise set to false
   */
  readonly proxy_randomize_credentials: booleanString;
}

export interface LocalAddresses {
  /**
   * An IP address or .onion address this node believes it listens on. This may be manually configured, auto detected, or based on version messages this node received from its peers
   */
  readonly address: string;
  /**
   * The port number this node believes it listens on for the associated address. This may be manually configured, auto detected, or based on version messages this node received from its peers
   */
  readonly port: number;
  /**
   * The number of incoming connections during the uptime of this node that have used this address in their version message
   */
  readonly score: number;
}

export interface NetworkInfo {
  /**
   * This node’s version of Dash Core in its internal integer format. For example, Dash Core 0.12.2 has the integer version number 120200
   */
  readonly version: number;
  /**
   * The user agent this node sends in its version message
   */
  readonly subversion: string;
  /**
   * The protocol version number used by this node. See the protocol versions section for more information
   */
  readonly protocolversion: number;
  /**
   * The services supported by this node as advertised in its version message
   */
  readonly localservices: number;
  /**
   * Added in Bitcoin Core 0.13.0
   * The services supported by this node as advertised in its version message
   */
  readonly localrelay: booleanString;
  /**
   * The offset of the node’s clock from the computer’s clock (both in UTC) in seconds. The offset may be up to 4200 seconds (70 minutes)
   */
  readonly timeoffset: number;
  /**
   * Is network active. Couldn't really find much information about this though.
   */
  readonly networkactive: booleanString;
  /**
   * The total number of open connections (both outgoing and incoming) between this node and other nodes
   */
  readonly connections: number;
  /**
   * An object describing a network. If the network is unroutable, it will not be returned
   */
  readonly networks: [Network];
  /**
   * The minimum relay fee for non-free transactions in order for this node to accept it into its memory pool
   */
  readonly relayfee: number;
  /**
   * Added in Dash Core 0.12.3
   * The minimum fee increment for mempool limiting or BIP 125 replacement in DASH/kB
   */
  readonly incrementalfee: number;
  /**
   * An array of objects each describing the local addresses this node believes it listens on
   */
  readonly localaddresses: [LocalAddresses];
  /**
   * Added in Bitcoin Core 0.11.0
   * A plain-text description of any network warnings. If there are no warnings, an empty string will be returned.
   */
  readonly warnings: string;
}

export interface GovernanceInfo {
  /**
   * the absolute minimum number of votes needed to trigger a governance action
   */
  readonly governanceminquorum: number;
  /**
   * Deprecated in Dash Core 0.12.3.0
   * sentinel watchdog expiration time in seconds
   */
  readonly masternodewatchdogmaxseconds: number;
  /**
   * Added in Dash Core 0.12.3.0
   * sentinel ping expiration time in seconds
   */
  readonly sentinelpingmaxseconds: number;
  /**
   * the proposal fee amount
   */
  readonly proposalfee: number;
  /**
   * the number of blocks between superblocks
   */
  readonly superblockcycle: number;
  /**
   * the last superblock mined
   */
  readonly lastsuperblock: number;
  /**
   * the next superblock to be mined
   */
  readonly nextsuperblock: number;
  /**
   * the maximum size in bytes (I think) of a governance object
   */
  readonly maxgovobjdatasize: number;

}

export interface MiningInfo {
  /**
   * The height of the highest block on the local best block chain
   */
  readonly blocks: number;
  /**
   * If generation was enabled since the last time this node was restarted, this is the size in bytes of the last block built by this node for header hash checking. Otherwise, the value 0
   */
  readonly currentblocksize: number;
  /**
   * If generation was enabled since the last time this node was restarted, this is the number of transactions in the last block built by this node for header hash checking. Otherwise, this is the value 0
   */
  readonly currentblocktx: number;
  /**
   * If generation was enabled since the last time this node was restarted, this is the difficulty of the highest-height block in the local best block chain. Otherwise, this is the value 0
   */
  readonly difficulty: number;
  /**
   * A plain-text description of any errors this node has encountered or detected. If there are no errors, an empty string will be returned. This is not related to the JSON-RPC error field.
   */
  readonly errors: string;
  /**
   * The processor limit for generation (-1 if no generation - see getgenerate or setgenerate calls).
   * Removed in Bitcoin Core 0.13.0
   */
  readonly genproclimit: number;
  /**
   * An estimate of the number of hashes per second the network is generating to maintain the current difficulty. See the getnetworkhashps RPC for configurable access to this data
   */
  readonly networkhashps: number;
  /**
   * Set to true if this node is running on testnet. Set to false if this node is on mainnet or a regtest
   * Removed in Bitcoin Core 0.14.0
   */
  readonly testnet: booleanString;
  /**
   * Set to main for mainnet, test for testnet, and regtest for regtest
   */
  readonly chain: string;
  /**
   * Set to true if generation is currently enabled; set to false if generation is currently disabled. Only returned if the node has wallet support enabled
   * Removed in Bitcoin Core 0.13.0
   */
  readonly generate: booleanString;
}
