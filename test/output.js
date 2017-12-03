const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const {
  writeFile
} = require('../lib/output');

const inputArray = [
  {
    lineText: '12cdefg',
    counts: {
      a: 1,
      b: 1
    }
  },
  {
    lineText: 'gf2dc2e2',
    counts: {
      b: 3
    }
  }
];

test('writeFile', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/inplace_true.txt';

  await writeFile(inputPath, inputStream)
  
  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    '12cdefg\ngf2dc2e2'
  )

})

test('writeFile error', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp//';

  const error = await t.throws(writeFile(inputPath, inputStream), Error);

  t.is(
    error.message,
    'EISDIR: illegal operation on a directory, open \'./tmp//\''
  )

})