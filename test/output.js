const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const interceptStdout = require("intercept-stdout");
const {
  removeFile
} = require('./_util')
const {
  outputStream,
  writeOutput,
  writeFile,
  writeStdout,
  gatherCounts,
  convertFromReplaceMap,
  convertToFileReplacementCounts
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
const outputContent = '12cdefg\ngf2dc2e2';

test.serial('outputStream inPlace false', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/outputStream.txt';

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {
    testOutput += testLine
  })

  await outputStream(inputPath, false, inputStream)

  stopStdoutcapture()
  
  t.is(
    testOutput,
    outputContent
  )
  
})

test('outputStream inPlace true', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/outputStream.txt';

  await outputStream(inputPath, true, inputStream)

  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    outputContent
  )
  
})

test('outputStream inPlace string', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/outputStream.txt';
  const outputPath = './tmp/outputStream.txt.backup';

  await outputStream(inputPath, '.backup', inputStream)

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent
  )

  removeFile(outputPath)
  
})

test('writeOutput file', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/writeOutput.txt';
  const intputWriteFileFn = writeFile(inputPath);

  await writeOutput(inputStream, intputWriteFileFn)
  
  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    outputContent
  )

  removeFile(inputPath)

})

test('writeOutput file error', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp//';
  const intputWriteFileFn = writeFile(inputPath);

  const testError = await t.throws(writeOutput(inputStream, intputWriteFileFn), Error);

  t.is(
    testError.message,
    'EISDIR: illegal operation on a directory, open \'./tmp//\''
  )

})

test('gatherCounts', async (t) => {

  const inputStream = _(inputArray)

  t.deepEqual(
    await inputStream
    .through(gatherCounts),
    {
      a: 1,
      b: 4
    }
  )

})

test.serial('writeOutput stdout', async (t) => {

  const inputStream = _(inputArray)

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {
    testOutput += testLine
  })

  await writeOutput(inputStream)

  stopStdoutcapture()
  
  t.is(
    testOutput,
    outputContent
  )

})

test('convertToFileReplacementCounts', (t) => {

  const inputFileReplacementCounts = [
    {
      path: '/tmp/test_1.json',
      counts: {
        '${a}': 100,
        '${b}': 200,
      },
    },
    {
      path: '/tmp/test_2.json',
      counts: {
        '${c}': 10,
        '${b}': 20,
      },
    }
  ];
  const outputFileReplacementCount = {
    '/tmp/test_1.json': {
      'a': 100,
      'b': 200,
    },
    '/tmp/test_2.json': {
      'c': 10,
      'b': 20,
    }
  };

  t.deepEqual(
    convertToFileReplacementCounts(inputFileReplacementCounts),
    outputFileReplacementCount
  )
  
})