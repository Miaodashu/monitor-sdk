'use strict';

const performance = require('..');
const assert = require('assert').strict;

assert.strictEqual(performance(), 'Hello from performance');
console.info('performance tests passed');
