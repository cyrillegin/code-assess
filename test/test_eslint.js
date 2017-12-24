import {assert} from 'chai';
import './../bin/code-assess';

describe('EsLint tests', () => {
  it('should run eslint with a local rc file.', () => {
    eslint();
  });
  it('should run eslint with default rc file.', () => {
    eslint();
  });
});
