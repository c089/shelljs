var shell = require('..');

var assert = require('assert'),
    fs = require('fs');

describe('which', function() {
  
  beforeEach(function() {
    shell.cd(__dirname);    
    shell.config.silent = true;
  });
  
  it('all tests', function() {

shell.rm('-rf', 'tmp');
shell.mkdir('tmp');

//
// Invalids
//

shell.which();
assert.ok(shell.error());

var result = shell.which('asdfasdfasdfasdfasdf'); // what are the odds...
assert.equal(shell.error(), null);
assert.equal(result, null);

//
// Valids
//

var result = shell.which('node');
assert.equal(shell.error(), null);
assert.equal(fs.existsSync(result), true);
  });
});
