import {assert} from 'chai';
import {sonarwhal} from './../bin/code-assess';
import {startServer, stopServer} from './server/server';

describe('Sonarwhal tests', () => {

  it('should run sonarwhal.', async () => {
    startServer('index_success.html');
    console.log('server started');
    const err = await sonarwhal('test/testFiles/success');
    stopServer();
    // assert.isNull(err);
    console.log('done')
  }).timeout(5000);

  // it('should run sonarwhal and throw an error.', async () => {
  //   const err = await sonarwhal('test/testFiles/fail');
  //   assert.isNotNull(err.Error);
  // }).timeout(5000);
});
