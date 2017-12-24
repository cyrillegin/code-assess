#!/usr/bin/env node
'strict';
const fs = require('fs');
const {exec} = require('child_process');

function precheck(location) {
  console.log('Checking: ', location);
  let directory = '';
  const fileExists = fs.existsSync(location);
  if (! fileExists) {
    console.log('File/Folder does not exist, using current directory');
    directory = '.';
  } else {
    directory = location;
  }
  return directory;
}

function eslint(location) {
  console.log('ESLint');
  const rc = getRC('.eslintrc.json');
  exec(`./node_modules/.bin/eslint -c ${rc} ${location}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from eslint:');
      console.log(stdout);
    }
    return 'done';
  });
}

function htmlhint(location) {
  console.log('HTMLHint');
  const rc = getRC('.htmlhintrc');
  exec(`./node_modules/.bin/htmlhint --config ${rc} ${location}`, (err, stdout, stderr) => {
    if (err) {
      console.log('Errors from htmlhint');
      console.log(stdout);
    }
  });
}

function scsslint(location) {
  console.log('SCSSLint');
  const rc = getRC('..sass-lint.yml');
  exec(`./node_modules/.bin/sass-lint location "**/*.scss" -v -q --config ${rc}`, (err, stdout, stderr) => {
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

// This checks to see if there is a local rc file, if not, use ours.
function getRC(file) {
  return fs.existsSync(file) ? file : `node_modules/code-assess/${file}`;
}

function main(location) {
  precheck(location);
  let options;
  try {
    options = JSON.parse(fs.readFileSync(getRC('.code-assessrc.json')));
  } catch (err) {
    console.log('Error parsing code-assessrc.json file.');
    throw err;
  }
  if (options.eslint !== undefined && options.eslint.run) {
    eslint(location);
  }
  if (options.htmlhint !== undefined && options.htmlhint.run) {
    htmlhint(location);
  }
  if (options.scsslint !== undefined && options.scsslint.run) {
    scsslint(location);
  }
  if (options.sonarwhal !== undefined && options.sonarwhal.run) {
    // sonarwhal(location);
  }
}


export default main;
export {eslint, htmlhint, scsslint};


if (require.main === module) {
  (async () => {
    console.log('Running tests.');
    const arg = process.argv[2];
    main(arg);
  })();
}
