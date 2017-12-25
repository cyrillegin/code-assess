import {assert} from 'chai';
import {eslint} from './../src/code-assess';

describe('EsLint tests', () => {

  it('should run eslint with a local rc file.', async () => {
    const err = await eslint('test/testFiles/success');
    assert.isNull(err);
  }).timeout(5000);

  it('should run eslint with default rc file.', async () => {
    const err = await eslint('test/testFiles/success', '.eslintrc.json');
    assert.isNull(err);
  }).timeout(5000);

  it('should run eslint and throw an error.', async () => {
    const err = await eslint('test/testFiles/fail');
    assert.isNotNull(err.Error);
  }).timeout(5000);
});
