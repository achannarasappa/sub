const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const R = require('ramda');
const {
  inputFiles,
  inputReplaceMap,
  outputCounts
} = require('./_fixtures')
const {
  createFiles,
  removeFiles
} = require('./_util')
const {
  substitute
} = require('../lib/main');

test.beforeEach((t) => createFiles(inputFiles));

test.serial('substitute', async (t) => {
  
  const testCounts = await substitute(['./tmp/*.json'], inputReplaceMap, false);

  t.deepEqual(
    testCounts,
    outputCounts
  )

})

test.afterEach((t) => removeFiles(inputFiles));