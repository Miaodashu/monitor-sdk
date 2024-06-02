'use strict';

const console = require('..');
const assert = require('assert').strict;

assert.strictEqual(console(), 'Hello from console');
console.info('console tests passed');
