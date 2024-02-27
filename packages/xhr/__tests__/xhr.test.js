'use strict';

const xhr = require('..');
const assert = require('assert').strict;

assert.strictEqual(xhr(), 'Hello from xhr');
console.info('xhr tests passed');
