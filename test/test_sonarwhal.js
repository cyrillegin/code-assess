import {assert} from 'chai';
import {sonarwhal} from './../bin/code-assess';
import {startServer, stopServer} from './server/server';

describe('Sonarwhal tests', () => {

  it('should run sonarwhal.', async () => {
    startServer('index_success.html');
    const err = await sonarwhal('localhost:4321');
    await stopServer();
    assert.isNull(err);
  }).timeout(15000);

  it('should run sonarwhal and throw an error.', async () => {
    startServer('index_fail.html');
    const err = await sonarwhal('localhost:4321');
    await stopServer();
    assert.isNotNull(err.Error);
  }).timeout(15000);
});
