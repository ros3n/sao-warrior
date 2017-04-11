#!/usr/bin/env node

require('babel-polyfill');

const Runner = require('./src/Runner').default;

const runner = new Runner(process.argv);
runner.run();
