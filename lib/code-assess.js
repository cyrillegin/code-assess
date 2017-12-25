#!/usr/bin/env node
'use strict';

'strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sonarwhal = exports.scsslint = exports.htmlhint = exports.eslint = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function precheck(location) {
  console.log('Checking: ', location);
  let directory = '';
  const fileExists = _fs2.default.existsSync(location);
  if (!fileExists) {
    console.log('File/Folder does not exist, using current directory');
    directory = '.';
  } else {
    directory = location;
  }
  return directory;
}

// This checks to see if there is a local rc file, if not, use ours.
function getRC(file) {
  return _fs2.default.existsSync(file) ? file : `node_modules/code-assess/${file}`;
}

function loadConfig(file, config) {
  let rc;
  if (config) {
    if (_fs2.default.existsSync(config)) {
      rc = config;
    } else {
      console.log('Config file not found, using defualt');
      rc = getRC(file);
    }
  } else {
    rc = getRC(file);
  }
  return rc;
}

function loadTest(test) {
  return _fs2.default.existsSync(`node_modules/.bin/${test}`) ? `node_modules/.bin/${test}` : `node_modules/code-assess/node_modules/.bin/${test}`;
}

function eslint(location, config) {
  console.log('Running ESLint');
  const rc = loadConfig('.eslintrc.json', config);
  const test = loadTest('eslint');
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(`./${test} -c ${rc} ${location}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from eslint:');
        console.log(stdout);
      }
      resolve(err);
    });
  });
}

function htmlhint(location, config) {
  console.log('Running HTMLHint');
  const rc = loadConfig('.htmlhintrc.json', config);
  const test = loadTest('htmlhint');
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(`./${test} --config ${rc} ${location}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from htmlhint');
        console.log(stdout);
      }
      resolve(err);
    });
  });
}

function scsslint(location, config) {
  console.log('Running SCSSLint');
  const rc = loadConfig('.sass-lint.yml', config);
  const test = loadTest('sass-lint');
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(`./${test} '${location}/**/*.scss' -v -q --config ${rc}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from scsslint');
        console.log(stdout);
      }
      resolve(err);
    });
  });
}

function sonarwhal(location, config) {
  console.log('Running Sonarwhal');
  // const rc = loadConfig('.sonarwhalrc', config);
  const test = loadTest('sonarwhal');
  return new Promise((resolve, reject) => {
    (0, _child_process.exec)(`./${test} ${location}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from Sonarwhal');
        console.log(err);
        console.log(stderr);
        console.log(stdout);
      }
      resolve(err);
    });
  });
}

async function main(location) {
  precheck(location);
  let options;
  try {
    options = JSON.parse(_fs2.default.readFileSync(getRC('.code-assessrc.json')));
  } catch (err) {
    console.log('Error parsing code-assessrc.json file.');
    throw err;
  }
  if (options.eslint !== undefined && options.eslint.run) {
    await eslint(location);
  }
  if (options.htmlhint !== undefined && options.htmlhint.run) {
    await htmlhint(location);
  }
  if (options.scsslint !== undefined && options.scsslint.run) {
    await scsslint(location);
  }
  if (options.sonarwhal !== undefined && options.sonarwhal.run) {
    await sonarwhal(options.sonarwhal.uri);
  }
}

exports.default = main;
exports.eslint = eslint;
exports.htmlhint = htmlhint;
exports.scsslint = scsslint;
exports.sonarwhal = sonarwhal;


if (require.main === module) {
  (async () => {
    console.log('Running tests.');
    const arg = process.argv[2];
    await main(arg);
  })();
}