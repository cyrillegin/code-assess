#!/usr/bin/env node

const {exec} = require('child_process');

console.log('Running tests.');

function eslint() {
  console.log('ESLint');
  exec('./node_modules/.bin/eslint bin', (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from eslint:');
      console.log(stdout);
    }
    return 'done';
  });
}

function htmlhint() {
  console.log('HTMLHint');
  exec('./node_modules/.bin/htmlhint --config .htmlhintrc bin', (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from htmlhint');
      console.log(stdout);
    }
  });
}

function scsslint() {
  console.log('SCSSLint');
  exec('./node_modules/.bin/sass-lint bin "**/*.scss" -v -q', (err, stdout, stderr) => {
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

function main() {
  eslint();
  htmlhint();
  scsslint();
  // sonarwhal();
}

main();
