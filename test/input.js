const test = require('ava');
const fs = require('fs');
const _ = require('highland');
const R = require('ramda');
const {
  removeFile
} = require('./_util')
const {
  inputStream
} = require('../lib/input');

test('inputStream', async (t) => {

  const inputFiles = [
    {
      path: './tmp/test-1.json',
      content: '1'
    },
    {
      path: './tmp/test-2.json',
      content: '2'
    },
    {
      path: './tmp/test-3.json',
      content: '3'
    },
  ];
  const outputContents = R.pluck('content', inputFiles)

  R.map(({ path, content }) => fs.writeFileSync(path, content, 'utf8'), inputFiles)

  await inputStream('./tmp/*.json')
  .sequence()
  .collect()
  .toPromise(Promise)
  .then((testResult) => {
  
    t.deepEqual(
      testResult,
      outputContents
    )
    
  })

  R.map(({ path, content }) => removeFile(path), inputFiles)

})