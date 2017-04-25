#!/usr/bin/env node

require('babel-polyfill');

const Runner = require('./lib/Runner').default;

const runner = new Runner(process.argv);
runner.run();
