import {assert} from 'chai';
import {sonarwhal} from './../src/code-assess';
import {startServer, stopServer} from './server/server';

describe('Sonarwhal tests', () => {

  it('should run sonarwhal.', async () => {
    console.log(process.env)
    if (process.env.CI === true) {
      console.log('skipping sonarwhal test in travis');
      return;
    }
    startServer('index_success.html', 4444);
    const err = await sonarwhal('localhost:4444');
    await stopServer();
    assert.isNull(err);
  }).timeout(15000);

  it('should run sonarwhal and throw an error.', async () => {
    if (process.env.CI === true) {
      console.log('skipping sonarwhal test in travis');
      return;
    }
    startServer('index_fail.html', 4443);
    const err = await sonarwhal('localhost:4443');
    await stopServer();
    assert.isNotNull(err.Error);
  }).timeout(15000);
});
