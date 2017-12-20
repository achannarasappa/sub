const test = require('ava');
const {
  inputFiles,
  inputReplaceMap,
  outputCounts,
} = require('./_fixtures');
const {
  createFiles,
  removeFiles,
} = require('./_util');
const { substitute } = require('../lib/main');

test.beforeEach(() => createFiles(inputFiles));

test('substitute', async (t) => {

  const testCounts = await substitute(['tmp/*.json'], inputReplaceMap, false);

  t.deepEqual(
    testCounts,
    outputCounts,
  );

});

test.afterEach(() => removeFiles(inputFiles));
