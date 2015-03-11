var shell = require('..');

var assert = require('assert');

describe('env', function() {
  
  beforeEach(function() {
    shell.cd(__dirname);    
    shell.config.silent = true;
  });
  
  it('all tests', function() {

shell.rm('-rf', 'tmp');
shell.mkdir('tmp');

//
// Valids
//

assert.equal(shell.env['PATH'], process.env['PATH']);

shell.env['SHELLJS_TEST'] = 'hello world';
assert.equal(shell.env['SHELLJS_TEST'], process.env['SHELLJS_TEST']);
  });
});
