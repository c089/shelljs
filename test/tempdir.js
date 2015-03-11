var shell = require('..');

var assert = require('assert'),
    fs = require('fs');

describe('tempdir', function() {
  
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

var tmp = shell.tempdir();
assert.equal(shell.error(), null);
assert.equal(fs.existsSync(tmp), true);
  });
});
