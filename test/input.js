const test = require('ava');
const fs = require('fs');
const _ = require('highland');
const R = require('ramda');
const {
  removeFile
} = require('./_util')
const {
  inputFiles,
} = require('./_fixtures')
const {
  inputStream
} = require('../lib/input');

test.beforeEach((t) => {
	R.map(({ path, content }) => fs.writeFileSync(path, content, 'utf8'), inputFiles)
});

test.serial('inputStream', async (t) => {

  const outputContents = R.map(({ path, content }) => ({ path, stream: content }), inputFiles)

  await inputStream('./tmp/*.json')
  // .sequence()
  .map(async ({ stream, path }) => ({ stream: await stream.toPromise(Promise), path }))
  .collect()
  .toPromise(Promise)
  .then((promises) => Promise.all(promises))
  .then((testResult) => {
  
    t.deepEqual(
      testResult,
      outputContents
    )
    
  })

})

test.afterEach((t) => {
	R.map(({ path, content }) => removeFile(path), inputFiles)
});