'use strict';

const fetch = require('..');
const assert = require('assert').strict;

assert.strictEqual(fetch(), 'Hello from fetch');
console.info('fetch tests passed');
