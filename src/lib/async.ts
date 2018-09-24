import { Assertions } from 'ava';

/**
 * Return a Promise that is completed after specified time
 * @param ms Time in milliseconds
 */
function sleep(ms: number): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * Run a test assertion until it succeeds or max tries is exhausted
 * @param t Ava's Assertions instance
 * @param fn check to be executed
 * @param maxTries max number of times to try fn check
 * @param delayInMillis delay between checks in milliseconds
 */
export async function retryUntilTrue(
  t: Assertions,
  fn: () => Promise<boolean>,
  maxTries: number = 40,
  delayInMillis: number = 100
): Promise<void> {
  for (let i = 0; i < maxTries; i++) {
    const r = await fn();
    if (r) {
      t.pass();
      return;
    }
    await sleep(delayInMillis);
  }

  t.fail(`failed after ${maxTries} attempts`);
}
