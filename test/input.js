const test = require('ava');
const fs = require('fs');
const _ = require('highland');
const R = require('ramda');
const {
  createFiles,
  removeFiles,
} = require('./_util');
const { inputFiles } = require('./_fixtures');
const { inputStream } = require('../lib/input');

test.beforeEach((t) => createFiles(inputFiles));

test('inputStream', async (t) => {

  const outputContents = R.map(({
    path, content,
  }) => ({
    path, stream: content,
  }), inputFiles);

  await inputStream(['./tmp/*.json'])
    .map(async ({
      stream, path,
    }) => ({
      stream: await stream.toPromise(Promise), path,
    }))
    .collect()
    .toPromise(Promise)
    .then((promises) => Promise.all(promises))
    .then((testResult) => {

      t.deepEqual(
        testResult,
        outputContents,
      );

    });

});

test.afterEach((t) => removeFiles(inputFiles));
