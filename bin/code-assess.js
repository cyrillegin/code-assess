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

// This checks to see if there is a local rc file, if not, use ours.
function getRC(file) {
  return fs.existsSync(file) ? file : `node_modules/code-assess/${file}`;
}

function loadConfig(file, config) {
  let rc;
  if (config) {
    if (fs.existsSync(config)) {
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

function eslint(location, config) {
  console.log('Running ESLint');
  const rc = loadConfig('.eslintrc.json', config);
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/eslint -c ${rc} ${location}`, (err, stdout, stderr) => {
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
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/htmlhint --config ${rc} ${location}`, (err, stdout, stderr) => {
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
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/sass-lint '${location}/**/*.scss' -v -q --config ${rc}`, (err, stdout, stderr) => {
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
  return new Promise((resolve, reject) => {
    exec(`./node_modules/.bin/sonarwhal ${location}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from Sonarwhal');
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
    options = JSON.parse(fs.readFileSync(getRC('.code-assessrc.json')));
  } catch (err) {
    console.log('Error parsing code-assessrc.json file.');
    throw err;
  }
  if (options.eslint !== undefined && options.eslint.run) {
    // await eslint(location);
  }
  if (options.htmlhint !== undefined && options.htmlhint.run) {
    // await htmlhint(location);
  }
  if (options.scsslint !== undefined && options.scsslint.run) {
    // await scsslint(location);
  }
  if (options.sonarwhal !== undefined && options.sonarwhal.run) {
    await sonarwhal(options.sonarwhal.uri);
  }
}


export default main;
export {eslint, htmlhint, scsslint, sonarwhal};


if (require.main === module) {
  (async () => {
    console.log('Running tests.');
    const arg = process.argv[2];
    await main(arg);
  })();
}
