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
  removeFile
} = require('./_util')
const {
  findAndReplace
} = require('../lib/main');

test.beforeEach((t) => createFiles(inputFiles));

test.serial('findAndReplace', async (t) => {
  
  const testCounts = await findAndReplace('./tmp/*.json', inputReplaceMap, false);

  t.deepEqual(
    testCounts,
    outputCounts
  )

})

test.afterEach((t) => removeFiles(inputFiles));