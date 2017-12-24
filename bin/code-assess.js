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
  console.log(options.rc);
  console.log('done')
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
  let directory = '';
  const fileExists = fs.existsSync(arg);
  if (! fileExists) {
    console.log('File/Folder does not exist, using current directory');
    directory = '.';
  } else {
    directory = arg;
  }
  return directory;
}

const testList = [
  ['eslint', '.eslintrc.json'],
  ['scsslint', '.sass-lint.yml'],
  ['htmlhint', '.htmlhintrc'],
  ['sonarwhal', '.sonarwhalrc'],
];

function configure() {
  console.log('Checking for configs...');
  // Check for code-assess config.
  let options;
  try {
    options = JSON.parse(fs.readFileSync(getRC('.code-assessrc.json')));
  } catch (err) {
    console.log('Error reading code-assesrc file.');
    throw err;
  }
  // Fill in any missing options and default them not to run.
  testList.forEach((test) => {
    if (options[test[0]] !== undefined) {
      // Check if there is an already existing rc file for the test.
      const fileExists = fs.existsSync(test[1]);
      // If there is, add its rc file.
      if (fileExists) {
        options[test[0]] = {
          run: true,
          rc: getRC(test[1]),
        };
      // Else just don't run that test.
      } else {
        options[test[0]] = {
          run: false,
        };
      }
    } else {
      if (options[test[0]] === undefined) {
        options[test[0]] = {
          run: false,
        };
      }
      // If no overrides have been added, use default.
      if (options[test[0]].rc === undefined || options[test[0]].rc.length === 0) {
        options[test[0]].rc = getRC(test[1]);
      }
    }
  });

  return options;
}

// This checks to see if there is a local rc file, if not, use ours.
function getRC(file) {
  if (fs.existsSync(file)) {
    exec('pwd', (err, stdout, stderr) => {
      console.log(`Using: ${stdout}${file}`);
    }) ;
  }
  return fs.existsSync(file) ? file : `node_modules/code-assess/${file}`;
}

function main(arg) {
  precheck(arg);
  options = configure();
  console.log('Options are:')
  console.log(options);
  if (options.eslint.run) {
    eslint(options, arg);
  }
  if (options.htmlhint.run) {
    htmlhint(options, arg);
  }
  if (options.scsslint.run) {
    scsslint(options, arg);
  }
  if (options.sonarwhal.run) {
    // sonarwhal();
  }
}

const arg = process.argv[2];
main(arg);
