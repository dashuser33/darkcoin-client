import * as Req from 'request-promise-lite';
import * as DashD from './RPCDefinitions';

/**
 * Each call returns this
 */
export interface CallResult<A> {
  readonly result?: A;
  readonly error?: any;
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
export default class DarkcoinClient {
  public readonly config: DashdConfig;
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
   * Send an amount to a given address.
   * Returns transaction id.
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
  public signMessage(address: string, message: string): Promise<CallResult<string>> {
    return this.callRPCMethod<string>('signmessage', [address, message]);
  }

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
  
  // Masternodes
  /**
   * Returns key/value dictionary pairs for all masternodes.
   */
  public masternodeList(): Promise<CallResult<DashD.MasterNodeList>> {
    return this.callRPCMethod<DashD.MasterNodeList>('masternodelist', []);
  }

  // GObjects

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
    return this.callRPCMethod<DashD.GObjectCurrentVotesList>('gobject', ['getcurrentvotes', hash]);
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
}
