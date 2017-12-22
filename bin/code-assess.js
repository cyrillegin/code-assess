#!/usr/bin/env node
'strict';
const fs = require('fs');
const {exec} = require('child_process');

console.log('Running tests.');

function eslint(options, arg) {
  console.log('ESLint');
  exec(`./node_modules/.bin/eslint ${arg}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from eslint:');
      console.log(stdout);
    }
    return 'done';
  });
}

function htmlhint(options, arg) {
  console.log('HTMLHint');
  exec(`./node_modules/.bin/htmlhint --config ${options.rc} ${arg}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from htmlhint');
      console.log(stdout);
    }
  });
}

function scsslint(options, arg) {
  console.log('SCSSLint');
  exec(`./node_modules/.bin/sass-lint ${arg} "**/*.scss" -v -q`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from scsslint');
      console.log(stdout);
    }
  });
}

// function sonarwhal() {
//   console.log('sonarwhal');
//   exec('./node_modules/.bin/sonarwhal localhost:5000', (err, stdout, stderr) => {
//     if (err) {
//       console.log('Errors from Sonarwhal');
//       console.log(stdout);
//     }
//   });
// }

function precheck(arg) {
  console.log('Checking: ', arg);
  const fileExists = fs.existsSync(arg);
  if (! fileExists) {
    console.log('File/Folder does not exist, quitting');
    throw 'File/Folder does not exist, quitting';
  }
}

const testList = [
  ['eslint', '.eslintrc.json'],
  ['scsslint', '.sass-lint.yml'],
  ['htmlhint', '.htmlhintrc'],
];

function configure() {
  console.log('Checking for configs...');
  // Check for code-assess config.
  const options = JSON.parse(fs.readFileSync(getRC('.code-assessrc.json')));
  // Fill in any missing options and default them not to run.
  testList.forEach((test) => {
    if (! test[0] in options) {
      // Check if there is an already existing rc file for the test.
      const fileExists = fs.existsSync(test[1]);
      // If there is, use it as overrides.
      if (fileExists) {
        options[test] = {
          run: true,
          rc: getRC(test[1]),
        };
      // Else just don't run that test.
      } else {
        options[test] = {
          run: false,
        };
      }
    } else {
      // If no overrides have been added, use default.
      if (! 'rc' in options[test[0]] || options[test[0]].rc.length === 0) {
        options[test[0]].rc = getRC(test[1]);
      }
    }
  });

  // TODO: handle overrides
  console.log('options are: ');
  console.log(options);

  return options;
}

function getRC(file) {
  return fs.existsSync(file) ? file : `node_modules/code-assess/${file}`;
}

function main(arg) {
  precheck(arg);
  options = configure();

  eslint(options, arg);
  htmlhint(options, arg);
  scsslint(options, arg);
  // sonarwhal();
}

const arg = process.argv[2];
main(arg);
