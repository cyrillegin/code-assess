#!/usr/bin/env node
'use strict';

'strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flake8 = exports.sonarwhal = exports.scsslint = exports.htmlhint = exports.eslint = undefined;

var flake8 = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(location) {
    var result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log('Running flake8');
            _context.next = 3;
            return checkForDependency('flake8');

          case 3:
            result = _context.sent;

            if (!(result === '')) {
              _context.next = 7;
              break;
            }

            console.log('You do not currently have flake8 installed. Please install it using pip install flake8');
            throw new Error();

          case 7:
            return _context.abrupt('return', new Promise(function (resolve, reject) {
              (0, _child_process.exec)('flake8  --statistics --count ' + location + '/', function (err, stdout, stderr) {
                if (err) {
                  console.log('Errors from flake 8');
                  console.log(err);
                  console.log(stderr);
                  console.log(stdout);
                }
                resolve(err);
              });
            }));

          case 8:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function flake8(_x) {
    return _ref.apply(this, arguments);
  };
}();

var main = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(location) {
    var options, errors, index;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            precheck(location);
            options = void 0;
            _context2.prev = 2;

            options = JSON.parse(_fs2.default.readFileSync(getRC('.code-assessrc.json')));
            _context2.next = 10;
            break;

          case 6:
            _context2.prev = 6;
            _context2.t0 = _context2['catch'](2);

            console.log('Error parsing code-assessrc.json file.');
            throw _context2.t0;

          case 10:
            errors = [];

            if (!(options.eslint !== undefined && options.eslint.run)) {
              _context2.next = 17;
              break;
            }

            _context2.t1 = errors;
            _context2.next = 15;
            return eslint(location);

          case 15:
            _context2.t2 = _context2.sent;

            _context2.t1.push.call(_context2.t1, _context2.t2);

          case 17:
            if (!(options.htmlhint !== undefined && options.htmlhint.run)) {
              _context2.next = 23;
              break;
            }

            _context2.t3 = errors;
            _context2.next = 21;
            return htmlhint(location);

          case 21:
            _context2.t4 = _context2.sent;

            _context2.t3.push.call(_context2.t3, _context2.t4);

          case 23:
            if (!(options.scsslint !== undefined && options.scsslint.run)) {
              _context2.next = 29;
              break;
            }

            _context2.t5 = errors;
            _context2.next = 27;
            return scsslint(location);

          case 27:
            _context2.t6 = _context2.sent;

            _context2.t5.push.call(_context2.t5, _context2.t6);

          case 29:
            if (!(options.sonarwhal !== undefined && options.sonarwhal.run)) {
              _context2.next = 40;
              break;
            }

            index = 0;

          case 31:
            if (!(index < options.sonarwhal.uri.length)) {
              _context2.next = 40;
              break;
            }

            _context2.t7 = errors;
            _context2.next = 35;
            return sonarwhal(options.sonarwhal.uri[index]);

          case 35:
            _context2.t8 = _context2.sent;

            _context2.t7.push.call(_context2.t7, _context2.t8);

          case 37:
            index++;
            _context2.next = 31;
            break;

          case 40:
            if (!(options.flake8 !== undefined && options.flake8.run)) {
              _context2.next = 46;
              break;
            }

            _context2.t9 = errors;
            _context2.next = 44;
            return flake8(location);

          case 44:
            _context2.t10 = _context2.sent;

            _context2.t9.push.call(_context2.t9, _context2.t10);

          case 46:
            if (!(options.outdated !== undefined && options.outdated.run)) {
              _context2.next = 52;
              break;
            }

            _context2.t11 = errors;
            _context2.next = 50;
            return checkOutdated();

          case 50:
            _context2.t12 = _context2.sent;

            _context2.t11.push.call(_context2.t11, _context2.t12);

          case 52:
            errors.forEach(function (error) {
              if (error !== null) {
                process.exit(1);
              }
            });

          case 53:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[2, 6]]);
  }));

  return function main(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

require('babel-polyfill');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function precheck(location) {
  console.log('Checking: ', location);
  var directory = '';
  var fileExists = _fs2.default.existsSync(location);
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
  return _fs2.default.existsSync(file) ? file : 'node_modules/code-assess/' + file;
}

function loadConfig(file, config) {
  var rc = void 0;
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
  return _fs2.default.existsSync('node_modules/.bin/' + test) ? 'node_modules/.bin/' + test : 'node_modules/code-assess/node_modules/.bin/' + test;
}

function checkForDependency(dependency) {
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('which ' + dependency, function (err, stdout, stderr) {
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
  var rc = loadConfig('.eslintrc.json', config);
  var test = loadTest('eslint');
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('./' + test + ' -c ' + rc + ' ' + location, function (err, stdout, stderr) {
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
  var rc = loadConfig('.htmlhintrc.json', config);
  var test = loadTest('htmlhint');
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('./' + test + ' --config ' + rc + ' ' + location, function (err, stdout, stderr) {
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
  var rc = loadConfig('.sass-lint.yml', config);
  var test = loadTest('sass-lint');
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('./' + test + ' \'' + location + '/**/*.scss\' -v --config ' + rc, function (err, stdout, stderr) {
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
  var test = loadTest('sonarwhal');
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('./' + test + ' ' + location, function (err, stdout, stderr) {
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

function checkOutdated() {
  console.log('Checking for outdated dependencies.');
  return new Promise(function (resolve, reject) {
    (0, _child_process.exec)('npm outdated', function (err, stdout, stderr) {
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

exports.default = main;
exports.eslint = eslint;
exports.htmlhint = htmlhint;
exports.scsslint = scsslint;
exports.sonarwhal = sonarwhal;
exports.flake8 = flake8;


if (require.main === module) {
  _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    var arg;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log('Running tests.');
            arg = process.argv[2];
            _context3.next = 4;
            return main(arg);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }))();
}