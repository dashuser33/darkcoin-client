import test from 'ava';
import DarkcoinClient from './darkcoinClient';

test('Scraper test', t => {
  const config = new DarkcoinClient({
    url: 'http://localhost:8887',
    user: 'rpcuser',
    password: 'secret'
  });
  return config.sendToAddress('foo', undefined, 'bar').catch(e => {
    t.truthy(e && e instanceof Error);
    t.pass();
  })
});
