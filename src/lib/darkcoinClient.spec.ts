import test from 'ava';
import { DarkcoinClient } from './darkcoinClient';

test('Fail on undefined parameters', async t => {
  const config = new DarkcoinClient({
    url: 'http://localhost:8887',
    user: 'rpcuser',
    password: 'secret'
  });
  await config
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
