import {assert} from 'chai';
import {flake8} from './../src/code-assess';

describe('Flake8 tests', () => {

  it('should run flake8 and pass.', async () => {
    const err = await flake8('test/testFiles/success');
    assert.isNull(err);
  }).timeout(5000);

  it('should run flake8 and throw an error.', async () => {
    const err = await flake8('test/testFiles/fail');
    assert.isNotNull(err.Error);
  }).timeout(5000);
});
