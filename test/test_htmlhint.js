import {assert} from 'chai';
import {htmlhint} from './../bin/code-assess';

describe('HtmlHint tests', () => {

  it('should run htmlhint with a local rc file.', async () => {
    const err = await htmlhint('test/testFiles/success');
    assert.isNull(err);
  }).timeout(5000);

  it('should run htmllint with default rc file.', async () => {
    const err = await htmlhint('test/testFiles/success', '.htmlhintrc');
    assert.isNull(err);
  }).timeout(5000);

  it('should run eslint and throw an error.', async () => {
    const err = await htmlhint('test/testFiles/fail');
    assert.isNotNull(err.Error);
  }).timeout(5000);
});
