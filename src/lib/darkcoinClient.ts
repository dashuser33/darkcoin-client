import * as Req from 'request-promise-lite';
import * as DashD from './RPCDefinitions';

/**
 * Each method response returns one object like this
 * @typeparam A Type representing the actual result
 */
export interface CallResult<A> {
  /**
   * The type of result varies according to the method
   */
  readonly result?: A;
  /**
   * The error object if the call fails
   */
  readonly error?: any;
  /**
   * id associated with a particular call. It is a random ID unless specified
   * directly callRPCMethod
   */
  readonly id: number;
}

/**
 * Configurations for instantiating DarkcoinClient
 */
export interface DashdConfig {
  readonly url: string;
  readonly user: string;
  readonly password: string;
}

/**
 * Client instance for doing RPC calls on Dashd
 */
export class DarkcoinClient {
  public readonly config: DashdConfig;

  /**
   * Object revision number. Always set to '1'
   * See https://github.com/dashuser33/darkcoin-client/pull/6#pullrequestreview-153566527
   */
  public readonly defaultObjectRevision: string = '1';

  constructor(dashdConfig: DashdConfig) {
    this.config = dashdConfig;
  }

  /**
   * This methods allows to call any of the RPC methods provided by dashd directly.
   * Call it with 'help' for the full list of commands.
   * @param method name of the method to call, e.g getblockhash
   * @param params params of the method, e.g. height for getblockhash
   * @param callId id to associate with call
   */
  public callRPCMethod<T>(
    method: string,
    params: ReadonlyArray<any>,
    callId?: number
  ): Promise<CallResult<T>> {
    const id: number = callId ? callId : Math.floor(Math.random() * 100000);
    const auth = { user: this.config.user, password: this.config.password };
    const body = { method, params, id };
    const req = new Req.Request('POST', this.config.url, {
      json: true,
      body,
      auth
    });

    return req.run().then(response => {
      return (response as any) as CallResult<T>;
    });
  }

  // Wallet Methods

  /**
   * Mark in-wallet transaction <txid> as abandoned
   * This will mark this transaction and all its in-wallet descendants as abandoned which will allow
   * for their inputs to be respent.  It can be used to replace "stuck" or evicted transactions.
   * It only works on transactions which are not included in a block and are not currently in the mempool.
   * It has no effect on transactions which are already conflicted or abandoned.
   */
  public abandonTransaction(txId: string): Promise<CallResult<null>> {
    return this.callRPCMethod<null>('abandontransaction', [txId]);
  }

  /**
   * Returns an object containing various wallet state info.
   */
  public getWalletInfo(): Promise<CallResult<DashD.WalletInfo>> {
    return this.callRPCMethod<DashD.WalletInfo>('getwalletinfo', []);
  }

  /**
   * Returns a new Dash address for receiving payments.
   */
  public getNewAddress(): Promise<CallResult<string>> {
    return this.callRPCMethod<string>('getnewaddress', []);
  }

  /**
   * Updates list of temporarily unspendable outputs.
   * Temporarily lock (unlock=false) or unlock (unlock=true) specified transaction outputs.
   * T  If no transaction outputs are specified when unlocking then all current locked transaction outputs are unlocked.
   * A locked transaction output will not be chosen by automatic coin selection, when spending dashs.
   * Locks are stored in memory only. Nodes start with zero locked outputs, and the locked output list
   * is always cleared (by virtue of process exit) when a node stops or fails.
   * Also see the listunspent call
   * @param unlock Whether to unlock (true) or lock (false) the specified transactions
   * @param inputs list of transaction outputs
   */
  public lockUnspent(
    unlock: boolean,
    inputs: ReadonlyArray<DashD.TransactionOutput>
  ): Promise<CallResult<boolean>> {
    return this.callRPCMethod<boolean>('lockunspent', [unlock, inputs]);
  }

  /**
   * deletes the specified transaction from the wallet. Meant for use with pruned wallets and as a companion to importprunedfunds.
   * This will affect wallet balances.
   * @param txId The hex-encoded id of the transaction you are removing
   */
  public removePrunedFunds(txId: string): Promise<CallResult<null>> {
    return this.callRPCMethod<null>('removeprunedfunds', [txId]);
  }
  /**
   * Get all transactions in blocks since block [blockhash], or all transactions if omitted
   * @param headerHash The hash of a block header encoded as hex in RPC byte order.
   * All transactions affecting the wallet which are not in that block or any earlier
   * block will be returned, including unconfirmed transactions. Default is the hash
   * of the genesis block, so all transactions affecting the wallet are returned by default
   * @param targetConfirmations Sets the lastblock field of the results to the header
   * hash of a block with this many confirmations.
   * This does not affect which transactions are returned.
   * Default is 1, so the hash of the most recent block on the local best block chain is returned
   * @param includeWatchOnly If set to true, include watch-only addresses in details and
   * calculations as if they were regular addresses belonging to the wallet.
   * If set to false (the default), treat watch-only addresses as if they didn’t
   * belong to this wallet
   */
  public listSinceBlock(
    headerHash?: string,
    targetConfirmations?: number,
    includeWatchOnly?: boolean
  ): Promise<CallResult<ReadonlyArray<DashD.Transaction>>> {
    const params: ReadonlyArray<any> = [
      headerHash,
      targetConfirmations,
      includeWatchOnly
    ];
    return this.filterUndefined(arguments, params).then(filteredParams =>
      this.callRPCMethod<ReadonlyArray<DashD.Transaction>>(
        'listsinceblock',
        filteredParams
      )
    );
  }

  /**
   * Returns the most recent transactions that affect the wallet.
   * @param count The number of transactions to return. default 10
   * @param skip The number of transactions to return. default 0
   * @param includeWatchOnly Include transactions to watch-only addresses
   * (see 'importaddress'). default false
   */
  public listTransactions(
    count?: number,
    skip?: number,
    includeWatchOnly?: boolean
  ): Promise<CallResult<ReadonlyArray<DashD.Transaction>>> {
    const params: ReadonlyArray<any> = [
      '*', // account. Set to a default value
      count,
      skip,
      includeWatchOnly
    ];
    return this.filterUndefined(arguments, params).then(filteredParams =>
      this.callRPCMethod<ReadonlyArray<DashD.Transaction>>(
        'listtransactions',
        filteredParams
      )
    );
  }

  /**
   * Send an amount to a given address.
   * @param dest A P2PKH or P2SH address to which the dash should be sent
   * @param amount The amount to spent in dash
   * @param comment A locally-stored (not broadcast) comment assigned to this
   * transaction. Default is no comment
   * @param commentTo A locally-stored (not broadcast) comment assigned to this
   * transaction. Meant to be used for describing who the payment was sent to.
   * Default is no comment
   * @param subtractFeeFromAmount The fee will be deducted from the amount being
   * sent. The recipient will receive less dash than you enter in the amount field.
   * Default is false
   * @param useIS If set to true, send this transaction as InstantSend (default: false).
   * @param usePS If set to true, use anonymized funds only (default: false).
   * @return transaction id.
   */
  public sendToAddress(
    dest: string,
    amount: number,
    comment?: string,
    commentTo?: string,
    subtractFeeFromAmount?: boolean,
    useIS?: boolean,
    usePS?: boolean
  ): Promise<CallResult<string>> {
    const params: ReadonlyArray<any> = [
      dest,
      amount,
      comment,
      commentTo,
      subtractFeeFromAmount,
      useIS,
      usePS
    ];
    return this.filterUndefined(arguments, params).then(filteredParams =>
      this.callRPCMethod<string>('sendtoaddress', filteredParams)
    );
  }

  /**
   * Set the transaction fee per kB. Overwrites the paytxfee parameter.
   * @param amount The transaction fee in DASH/kB
   */
  public setTxFee(amount: number): Promise<CallResult<boolean>> {
    return this.callRPCMethod<boolean>('settxfee', [amount]);
  }

  /**
   * Sign a message with the private key of an address
   * @param address The dash address to use for the private key.
   * @param message The message to create a signature of.
   * @returns The signature of the message encoded in base 64
   */
  public signMessage(
    address: string,
    message: string
  ): Promise<CallResult<string>> {
    return this.callRPCMethod<string>('signmessage', [address, message]);
  }

  // Masternodes

  /**
   * Returns key/value dictionary pairs for all masternodes.
   */
  public masternodeList(): Promise<CallResult<DashD.MasterNodeList>> {
    return this.callRPCMethod<DashD.MasterNodeList>('masternodelist', []);
  }

  // GObjects

  /**
   * The gobject prepare RPC prepares a governance object by signing and creating a collateral transaction.
   * @param parentHash Hash of the parent object. usually the root node which has a hash of 0
   * @param creationTime Creation time as a unix timestamp
   * @param gobjectData Object data (JSON object with governance details)
   * @returns Transaction id for the collateral transaction
   */
  public gobjectPrepare(
    parentHash: string,
    creationTime: number,
    gobjectData: string
  ): Promise<CallResult<string>> {
    return this.callRPCMethod<string>('gobject', [
      'prepare',
      parentHash.toString(),
      this.defaultObjectRevision,
      creationTime.toString(),
      gobjectData
    ]);
  }

  /**
   * The gobject submit RPC submits a governance object to network (objects must first be prepared via gobject prepare).
   * @param parentHash Hash of the parent object. Usually the root node which has a hash of 0
   * @param creationTime Creation time as a unix timestamp (I think it needs to match the timestamp used in gobjectPrepare)
   * @param gobjectData Object data (JSON object with governance details)
   * @param txId Collateral transaction ID
   * @returns The resulting governance object hash
   */
  public gobjectSubmit(
    parentHash: string,
    creationTime: number,
    gobjectData: string,
    txId: string
  ): Promise<CallResult<string>> {
    return this.callRPCMethod<string>('gobject', [
      'submit',
      parentHash.toString(),
      this.defaultObjectRevision,
      creationTime.toString(),
      gobjectData,
      txId
    ]);
  }

  /**
   * Returns key/value pairs for all current GObjects with the key. Will include both funding gobjects and trigger gobjects,
   * Make sure to parse them and pull out the ones you want.
   */
  public gobjectList(): Promise<CallResult<DashD.GObjectList>> {
    return this.callRPCMethod<DashD.GObjectList>('gobject', ['list']);
  }

  public gobjectCurrentVotes(
    hash: string
  ): Promise<CallResult<DashD.GObjectCurrentVotesList>> {
    return this.callRPCMethod<DashD.GObjectCurrentVotesList>('gobject', [
      'getcurrentvotes',
      hash
    ]);
  }

  // Network Information

  /**
   * The getnetworkinfo RPC returns information about the node’s connection to the network.
   */
  public getNetworkInfo(): Promise<CallResult<DashD.NetworkInfo>> {
    return this.callRPCMethod<DashD.NetworkInfo>('getnetworkinfo', []);
  }

  /**
   * Returns network related governance info, i.e. superblock height, proposal fee, and minquorum.
   */
  public getGovernanceInfo(): Promise<CallResult<DashD.GovernanceInfo>> {
    return this.callRPCMethod<DashD.GovernanceInfo>('getgovernanceinfo', []);
  }

  /**
   * Returns mining related info, i.e. difficulty, blocksize, currentblocktx, and a network hash rate estimate.
   */
  public getMiningInfo(): Promise<CallResult<DashD.MiningInfo>> {
    return this.callRPCMethod<DashD.MiningInfo>('getmininginfo', []);
  }

  // Private Methods

  /**
   * Build the parameter list by removing optional arguments
   * @param originalArgs original argument list
   * @param params
   */
  private filterUndefined<T>(
    originalArgs: IArguments,
    params: ReadonlyArray<T>
  ): Promise<ReadonlyArray<T>> {
    const undefinedIndex = params.findIndex(v => v === undefined);
    if (undefinedIndex >= 0 && undefinedIndex < originalArgs.length - 1) {
      return Promise.reject(
        new Error('Undefined arguments found after defined arguments.')
      );
    }
    return Promise.resolve(params.filter(v => v !== undefined));
  }
}
