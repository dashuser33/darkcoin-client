import { serial as test } from 'ava';
import * as dotenv from 'dotenv';
import validator from 'wallet-address-validator';
import { retryUntilTrue } from './async';
import { DarkcoinClient } from './darkcoinClient';
import * as DashD from './RPCDefinitions';

// Try to load in a .env if there is one. Otherwise, continue.
try {
  dotenv.config();
} catch (err) {
  console.log(err);
  console.log('No .env file found, loading ENV variables from process.');
}

const user = process.env.DASHD_USER;
const password = process.env.DASHD_PASSWORD;
const url = process.env.DASHD_URI;

const client = new DarkcoinClient({
  url,
  user,
  password
});

/**
 * This test suite requires an instance of DashD.
 * DO NOT USE MAINNET or you might lose funds.
 */
test('Fail if required env vars are not defined', t => {
  t.truthy(user);
  t.truthy(password);
  t.truthy(url);
});

let receivingAddress: string;

const txFee = 0.0000001;
let initialWalletState: DashD.WalletInfo;

test('get initial wallet info', async t => {
  await client.getWalletInfo().then(r => {
    initialWalletState = r.result;
    t.true(r.result.walletversion > 0);
  });
});

test('set tx fee', async t => {
  await client.setTxFee(txFee).then(r => {
    t.is(r.result, true);
  });
});

test('get updated wallet info', async t => {
  await client.getWalletInfo().then(r => {
    t.is(r.result.paytxfee, txFee);
  });
});

test('get a receiving address', async t => {
  await client.getNewAddress().then(r => {
    const validationResult = validator.validate(r.result, 'dash', 'testnet');
    receivingAddress = r.result;
    t.is(validationResult, true);
  });
});

test('balance for new address should be zero', async t => {
  await client.getAddressBalance([receivingAddress]).then(r => {
    t.deepEqual(r.result, { balance: 0, received: 0 });
  });
});

let txId: string;
const amountTosend = 0.001;
const txIdSize = 64;
test('send to address', async t => {
  await client
    .sendToAddress(
      receivingAddress,
      amountTosend,
      'test tx',
      'internal address',
      false,
      false,
      false
    )
    .then(r => {
      txId = r.result;
      t.is(txId.length, txIdSize);
    });
});

test('get new balance', async t =>
  retryUntilTrue(
    t,
    async () => {
      return client.getAddressBalance([receivingAddress]).then(r => {
        return (
          r.result.balance === DarkcoinClient.convertDashToDuffs(amountTosend)
        );
      });
    },
    120,
    3000
  ));

test('revert tx fee to initial', async t => {
  await client.setTxFee(initialWalletState.paytxfee).then(r => {
    t.is(r.result, true);
  });
});
