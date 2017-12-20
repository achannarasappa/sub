const test = require('ava');
const R = require('ramda');
const {
  createFiles,
  removeFiles,
} = require('./_util');
const { inputFiles } = require('./_fixtures');
const { inputStream } = require('../lib/input');

test.beforeEach(() => createFiles(inputFiles));

test('inputStream', async (t) => {

  const outputContents = R.map(({
    path, content,
  }) => ({
    path, stream: content,
  }), inputFiles);

  await inputStream(['tmp/*.json'])
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

test.afterEach(() => removeFiles(inputFiles));
