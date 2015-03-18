var shell = require('..');

var assert = require('assert'),
  util = require('util');

describe('exec', function () {

  beforeEach(function () {
    shell.cd(__dirname);
    shell.config.silent = true;
  });

  describe('Invalids', function () {

    it('should fail without argument', function () {
      shell.exec();
      assert.ok(shell.error());
    });

    it('should fail if it cannot find command', function () {
      var result = shell.exec('asdfasdf'); // could not find command
      assert.ok(result.code > 0);
    });

    it("Test 'fatal' mode for exec, temporarily overriding process.exit", function () {
      var old_fatal = shell.config.fatal;
      var old_exit = process.exit;

      var exitcode = 9999;
      process.exit = function (_exitcode) {
        exitcode = _exitcode;
      };

      shell.config.fatal = true;

      var result = shell.exec('asdfasdf'); // could not find command
      assert.equal(exitcode, 1);

      shell.config.fatal = old_fatal;
      process.exit = old_exit;
    });

  });

  describe('valids', function () {

    describe('sync', function () {

      it('check if stdout goes to output', function () {
        var result = shell.exec('node -e \"console.log(1234);\"');
        assert.equal(shell.error(), null);
        assert.equal(result.code, 0);
        assert.ok(result.output === '1234\n' || result.output === '1234\nundefined\n'); // 'undefined' for v0.4
      });

      it('check if stderr goes to output', function () {
        var result = shell.exec('node -e \"console.error(1234);\"');
        assert.equal(shell.error(), null);
        assert.equal(result.code, 0);
        assert.ok(result.output === '1234\n' || result.output === '1234\nundefined\n'); // 'undefined' for v0.4
      });

      it('check if stdout + stderr go to output', function () {
        var result = shell.exec('node -e \"console.error(1234); console.log(666);\"');
        assert.equal(shell.error(), null);
        assert.equal(result.code, 0);
        assert.ok(result.output === '1234\n666\n' || result.output === '1234\n666\nundefined\n');  // 'undefined' for v0.4
      });

      it('check exit code', function () {
        var result = shell.exec('node -e \"process.exit(12);\"');
        assert.equal(shell.error(), null);
        assert.equal(result.code, 12);
      });

      it('interaction with cd', function () {

        shell.cd('resources/external');
        var result = shell.exec('node node_script.js');
        assert.equal(shell.error(), null);
        assert.equal(result.code, 0);
        assert.equal(result.output, 'node_script_1234\n');
        shell.cd('../..');

      });

      it('check quotes escaping', function () {
        var result = shell.exec(util.format('node -e "console.log(%s);"', "\\\"\\'+\\'_\\'+\\'\\\""));
        assert.equal(shell.error(), null);
        assert.equal(result.code, 0);
        assert.equal(result.output, "'+'_'+'\n");
      });

    });

    describe('async', function () {

      it('no callback', function () {
        var c = shell.exec('node -e \"console.log(1234)\"', {async: true});
        assert.equal(shell.error(), null);
        assert.ok('stdout' in c, 'async exec returns child process object');
      });

      it('callback as 2nd argument', function (done) {
        shell.exec('node -e \"console.log(5678);\"', function (code, output) {
          assert.equal(code, 0);
          assert.ok(output === '5678\n' || output === '5678\nundefined\n');  // 'undefined' for v0.4
          done();
        });
      });

      it('callback as 3rd argument', function (done) {
        shell.exec('node -e \"console.log(5566);\"', {async: true}, function (code, output) {
          assert.equal(code, 0);
          assert.ok(output === '5566\n' || output === '5566\nundefined\n');  // 'undefined' for v0.4
          done();
        });
      });

      it('callback as 3rd argument (slient:true)', function (done) {
        shell.exec('node -e \"console.log(5678);\"', {silent: true}, function (code, output) {
          assert.equal(code, 0);
          assert.ok(output === '5678\n' || output === '5678\nundefined\n');  // 'undefined' for v0.4
          done();
        });
      });

    });

  });

});
