Code Assess
=========

[![Build Status](https://travis-ci.org/cyrillegin/generic-tests.svg?branch=master)](https://travis-ci.org/cyrillegin/generic-tests)
[![Coverage Status](https://coveralls.io/repos/github/cyrillegin/generic-tests/badge.svg)](https://coveralls.io/github/cyrillegin/generic-tests)
[![dependencies Status](https://david-dm.org/cyrillegin/generic-tests/status.svg)](https://david-dm.org/cyrillegin/generic-tests)
[![devDependencies Status](https://david-dm.org/cyrillegin/generic-tests/dev-status.svg)](https://david-dm.org/cyrillegin/generic-tests?type=dev)

## Installation
`npm i -D code-assess` 
Optional: Add a .code-assessrc.json file to your root folder. This is where you can set up which linters and tests you would like to run. Although all of the tests come with preconfigured rc files, you can choose to add your own in your root directory and those will take precendence over the default configs.

## Usage
The easiest way to get up and running is adding: `"assess": "babel-node node_modules/.bin/code-assess src"` to your pacakge.json file. You can then run `npm run assess`

## Current Tests
#### ESLint
Website: https://eslint.org/  
Writing a config: https://eslint.org/docs/user-guide/configuring#using-configuration-files

#### SCSSLint
Website: https://github.com/brigade/scss-lint  
Writing a config: https://github.com/brigade/scss-lint#configuration

#### HTMLHint
Website: http://htmlhint.com/  
Writing a config: https://github.com/yaniswang/HTMLHint/wiki/Usage#about-htmlhintrc

#### Sonarwhal
Website: https://sonarwhal.com/  
Writing a config: https://sonarwhal.com/docs/user-guide/concepts/rules/
