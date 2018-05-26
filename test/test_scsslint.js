import 'babel-polyfill';
import {assert} from 'chai';
import {scsslint} from './../src/code-assess';

describe('ScssLint tests', () => {

  it('should run scsslint with a local rc file.', async () => {
    const err = await scsslint('test/testFiles/success');
    assert.isNull(err);
  }).timeout(5000);

  it('should run scsslint with default rc file.', async () => {
    const err = await scsslint('test/testFiles/success', '.sass-lint.yml');
    assert.isNull(err);
  }).timeout(5000);

  it('should run scsslint and throw an error.', async () => {
    const err = await scsslint('test/testFiles/fail');
    assert.isNotNull(err.Error);
  }).timeout(5000);
});
