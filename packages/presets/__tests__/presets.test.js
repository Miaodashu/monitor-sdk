'use strict';

const presets = require('..');
const assert = require('assert').strict;

assert.strictEqual(presets(), 'Hello from presets');
console.info('presets tests passed');
