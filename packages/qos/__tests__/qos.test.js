'use strict';

const qos = require('..');
const assert = require('assert').strict;

assert.strictEqual(qos(), 'Hello from qos');
console.info('qos tests passed');
