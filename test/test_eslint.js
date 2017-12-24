import {assert} from 'chai';
import {eslint} from './../bin/code-assess';

describe('EsLint tests', () => {

  it('should run eslint with a local rc file.', () => {
    eslint('test/testFiles/test_success.js');
  }).timeout(5000);

  it('should run eslint with default rc file.', () => {
    eslint('test/testFiles/test_success.js', '.eslintrc.json');
  }).timeout(5000);

  it('should run eslint and throw an error.', () => {
    let failed = false;
    try {
      eslint('test/testFiles/test_fail.js', '.eslintrc.json');
    } catch (err) {
      failed = true;
    }
    assert(failed === true);
  }).timeout(5000);
});
