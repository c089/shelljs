var shell = require('..');

var assert = require('assert'),
  fs = require('fs');

describe('cat', function () {

  beforeEach(function () {
    shell.cd(__dirname);
    shell.config.silent = true;
  });

  describe('invalids', function () {

    it('should fail without argument', function () {
      shell.cat();
      assert.ok(shell.error());
    });

    it('should fail when file does not exist', function () {
      assert.equal(fs.existsSync('/asdfasdf'), false); // sanity check
      shell.cat('/adsfasdf'); // file does not exist
      assert.ok(shell.error());
    });

  });

  describe('valids', function () {

    it('simple', function () {
      var result = shell.cat('resources/file1');
      assert.equal(shell.error(), null);
      assert.equal(result, 'test1');
    });

    it('multiple files', function () {
      var result = shell.cat('resources/file2', 'resources/file1');
      assert.equal(shell.error(), null);
      assert.equal(result, 'test2\ntest1');
    });

    it('multiple files, array syntax', function () {
      var result = shell.cat(['resources/file2', 'resources/file1']);
      assert.equal(shell.error(), null);
      assert.equal(result, 'test2\ntest1');
    });

    it('should cat multiple files when using a wildcard', function () {
      var result = shell.cat('resources/file*.txt');
      assert.equal(shell.error(), null);
      assert.ok(result.search('test1') > -1); // file order might be random
      assert.ok(result.search('test2') > -1);
    });

  });

});
