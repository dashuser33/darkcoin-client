import { serial as test } from 'ava';
import * as dotenv from 'dotenv';
import validator from 'wallet-address-validator';
import { DarkcoinClient } from './darkcoinClient';

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

test('Fail on undefined parameters', async t => {
  await client
    .sendToAddress('foo', undefined, 'bar')
    .then(r => t.fail('Should not have a result: ' + r))
    .catch(e => {
      t.truthy(
        e &&
          e instanceof Error &&
          e.message === 'Undefined arguments found after defined arguments.'
      );
    });
});

let receivingAddress: string;

test('get a receiving address', async t => {
  await client.getNewAddress().then(r => {
    const validationResult = validator.validate(r.result, 'dash', 'testnet');
    receivingAddress = r.result;
    t.is(validationResult, true);
  });
});

test('balance for new address should be zero', async t => {
  await client.getAddressBalance([receivingAddress]).then(r => {
    // t.truthy(receivingAddress);
    t.deepEqual(r.result, { balance: 0, received: 0 });
  });
});
