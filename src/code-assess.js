#!/usr/bin/env node
'strict';
import fs from 'fs';
import {exec} from 'child_process';

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

function loadTest(test) {
  return fs.existsSync(`node_modules/.bin/${test}`) ? `node_modules/.bin/${test}` : `node_modules/code-assess/node_modules/.bin/${test}`;
}

function checkForDependency(dependency) {
  return new Promise((resolve, reject) => {
    exec(`which ${dependency}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from dependency check:');
        console.log(err);
        console.log(stderr);
        console.log(stdout);
      }
      resolve(stdout);
    });
  });
}

function eslint(location, config) {
  console.log('Running ESLint');
  const rc = loadConfig('.eslintrc.json', config);
  const test = loadTest('eslint');
  return new Promise((resolve, reject) => {
    exec(`./${test} -c ${rc} ${location}`, (err, stdout, stderr) => {
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
    exec(`./${test} --config ${rc} ${location}`, (err, stdout, stderr) => {
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
    exec(`./${test} '${location}/**/*.scss' -v --config ${rc}`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from scsslint');
        console.log(stdout);
      }
      console.log(stdout);
      resolve(err);
    });
  });
}

function sonarwhal(location) {
  console.log('Running Sonarwhal');
  // const rc = loadConfig('.sonarwhalrc', config);
  const test = loadTest('sonarwhal');
  return new Promise((resolve, reject) => {
    exec(`./${test} ${location}`, (err, stdout, stderr) => {
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

async function flake8(location) {
  console.log('Running flake8');
  const result = await checkForDependency('flake8');
  if (result === '') {
    console.log('You do not currently have flake8 installed. Please install it using pip install flake8');
    throw new Error();
  }
  return new Promise((resolve, reject) => {
    exec(`flake8  --statistics --count ${location}/`, (err, stdout, stderr) => {
      if (err) {
        console.log('Errors from flake 8');
        console.log(err);
        console.log(stderr);
        console.log(stdout);
      }
      resolve(err);
    });
  });
}

function checkOutdated() {
  console.log('Checking for outdated dependencies.');
  return new Promise((resolve, reject) => {
    exec('npm outdated', (err, stdout, stderr) => {
      if (err) {
        console.log('Outdated packages:');
        console.log(stdout);
      } else {
        console.log('Dependencies are up to date!');
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
  let errors = [];
  if (options.eslint !== undefined && options.eslint.run) {
    errors.push(await eslint(location));
  }
  if (options.htmlhint !== undefined && options.htmlhint.run) {
    errors.push(await htmlhint(location));
  }
  if (options.scsslint !== undefined && options.scsslint.run) {
    errors.push(await scsslint(location));
  }
  if (options.sonarwhal !== undefined && options.sonarwhal.run) {
    for (let index = 0; index < options.sonarwhal.uri.length; index ++) {
      errors.push(await sonarwhal(options.sonarwhal.uri[index]));
    }
  }
  if (options.flake8 !== undefined && options.flake8.run) {
    errors.push(await flake8(location));
  }
  if (options.outdated !== undefined && options.outdated.run) {
    errors.push(await checkOutdated());
  }
  errors.forEach((error) => {
    if (error !== null) {
      process.exit(1);
    }
  });
}

export default main;
export {eslint, htmlhint, scsslint, sonarwhal, flake8};


if (require.main === module) {
  (async () => {
    console.log('Running tests.');
    const arg = process.argv[2];
    await main(arg);
  })();
}
