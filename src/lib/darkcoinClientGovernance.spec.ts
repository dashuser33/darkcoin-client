import { serial as test } from 'ava';
import * as dotenv from 'dotenv';
// import validator from 'wallet-address-validator';
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

test('get governance info', async t => {
  await client.getGovernanceInfo().then(r => {
    const inf = r.result;
    t.true(inf.proposalfee === 5);
    t.true(inf.nextsuperblock > 0);
    t.true(inf.superblockcycle === 24);
  });
});
