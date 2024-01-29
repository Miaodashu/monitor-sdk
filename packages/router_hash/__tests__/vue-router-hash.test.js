'use strict';

const vueRouterHash = require('..');
const assert = require('assert').strict;

assert.strictEqual(vueRouterHash(), 'Hello from vueRouterHash');
console.info('vueRouterHash tests passed');
