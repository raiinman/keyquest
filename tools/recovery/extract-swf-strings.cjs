#!/usr/bin/env node
const fs = require('node:fs');
const zlib = require('node:zlib');
const crypto = require('node:crypto');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node extract-swf-strings.cjs <local.swf>');
  process.exit(2);
}

const input = fs.readFileSync(file);
const signature = input.subarray(0, 3).toString('ascii');
const raw = signature === 'CWS'
  ? Buffer.concat([Buffer.from('FWS'), input.subarray(3, 8), zlib.inflateSync(input.subarray(8))])
  : input;

const strings = [...new Set(raw.toString('latin1').match(/[ -~]{5,}/g) || [])];
const relevant = strings.filter((value) => /(keyquest|\.swf|\.xml|https?:|server|gateway|asset|token|map|minigame|lobby|chat)/i.test(value));

console.log(`file=${file}`);
console.log(`bytes=${input.length}`);
console.log(`sha256=${crypto.createHash('sha256').update(input).digest('hex')}`);
console.log(`signature=${signature}`);
for (const value of relevant) console.log(value);

