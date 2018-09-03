import * as Req from 'request-promise-lite';
import * as DashD from './RPCDefinitions';

export interface CallResult<A> {
  readonly result?: A;
  readonly error?: any;
  readonly id: number;
}

export interface DashdConfig {
  readonly url: string;
  readonly user: string;
  readonly password: string;
}

export default class DarkcoinClient {
  public readonly config: DashdConfig;
  constructor(dashdConfig: DashdConfig) {
    this.config = dashdConfig;
  }

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
      console.log(JSON.stringify(response));
      return (response as any) as CallResult<T>;
    });
  }

  /**
   * Returns an object containing various wallet state info.
   */
  public getWalletInfo(): Promise<CallResult<DashD.WalletInfo>> {
    return this.callRPCMethod<DashD.WalletInfo>('getwalletinfo', []);
  }
}
