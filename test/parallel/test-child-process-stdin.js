'use strict';
const common = require('../common');
const assert = require('assert');

const spawn = require('child_process').spawn;

const cat = spawn(common.isWindows ? 'more' : 'cat');
cat.stdin.write('hello');
cat.stdin.write(' ');
cat.stdin.write('world');

assert.strictEqual(true, cat.stdin.writable);
assert.strictEqual(false, cat.stdin.readable);

cat.stdin.end();

let response = '';

cat.stdout.setEncoding('utf8');
cat.stdout.on('data', function(chunk) {
  console.log('stdout: ' + chunk);
  response += chunk;
});

cat.stdout.on('end', common.mustCall(function() {}));

cat.stderr.on('data', common.mustNotCall());

cat.stderr.on('end', common.mustCall(function() {}));

cat.on('exit', common.mustCall(function(status) {
  assert.strictEqual(0, status);
}));

cat.on('close', common.mustCall(function() {
  if (common.isWindows) {
    assert.strictEqual('hello world\r\n', response);
  } else {
    assert.strictEqual('hello world', response);
  }
}));
