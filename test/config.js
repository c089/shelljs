var shell = require('..');

var assert = require('assert'),
    child = require('child_process');

describe('config', function() {
  
  beforeEach(function() {
    shell.cd(__dirname);    
  });
  
  it('all tests', function() {

//
// config.silent
//

// shell is global, and since every tests sets it to `true` this will fail, when running in mocha
//assert.equal(shell.config.silent, false); // default

shell.config.silent = true;
assert.equal(shell.config.silent, true);

shell.config.silent = false;
assert.equal(shell.config.silent, false);

//
// config.fatal
//

assert.equal(shell.config.fatal, false); // default

//
// config.fatal = false
//
shell.mkdir('-p', 'tmp');
var file = 'tmp/tempscript'+Math.random()+'.js',
    script = 'require(\'../../global.js\'); config.silent=true; config.fatal=false; cp("this_file_doesnt_exist", "."); echo("got here");';
script.to(file);
child.exec('node '+file, function(err, stdout) {
  assert.ok(stdout.match('got here'));

  //
  // config.fatal = true
  //
  shell.mkdir('-p', 'tmp');
  var file = 'tmp/tempscript'+Math.random()+'.js',
      script = 'require(\'../../global.js\'); config.silent=true; config.fatal=true; cp("this_file_doesnt_exist", "."); echo("got here");';
  script.to(file);
  child.exec('node '+file, function(err, stdout) {
    assert.ok(!stdout.match('got here'));
  });
});

  });
});
    