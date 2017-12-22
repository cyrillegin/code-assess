#!/usr/bin/env node
'strict';
const fs = require('fs');
const {exec} = require('child_process');

console.log('Running tests.');

function eslint(arg) {
  console.log('ESLint');
  exec(`./node_modules/.bin/eslint ${arg}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from eslint:');
      console.log(stdout);
    }
    return 'done';
  });
}

function htmlhint(arg) {
  console.log('HTMLHint');
  exec(`./node_modules/.bin/htmlhint --config .htmlhintrc ${arg}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from htmlhint');
      console.log(stdout);
    }
  });
}

function scsslint(arg) {
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

function configure() {
  console.log('Checking for configs...');
  let options = {};
  // Check for code-assess config.
  const fileExists = fs.existsSync('.code-assessrc.json');
  if (fileExists) {
    console.log('is there')
    const data = fs.readFileSync('.code-assessrc.json');
    try {
      options = JSON.parse(data);
    } catch (err) {
      console.log('Error reading json:');
      console.log(err);
      throw err;
    }
  } else {
    options = {};
  }
  console.log('options are: ');
  console.log(options);
  // Check for eslint
  if (! fileExists) {
    options.eslintre = 'node_modules/code-assess/eslintrc.json';
  }
}

function main(arg) {
  precheck(arg);
  configure();
  eslint(arg);
  htmlhint(arg);
  scsslint(arg);
  // sonarwhal();
}

const arg = process.argv[2];
main(arg);
