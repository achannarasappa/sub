const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const R = require('ramda');
const interceptStdout = require("intercept-stdout");
const {
  removeFile,
  removeFiles,
  createFiles
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
const outputPath = './tmp/output-test.txt';
const outputFiles = [
  {
    path: outputPath,
    content: outputContent
  }
];
const inputContent = R.pipe(R.pluck('lineText'), R.join('\n'))(inputArray);
const inputFiles = [
  {
    path: outputFiles[0].path,
    content: inputContent
  }
];

test.serial('outputStream inPlace false', async (t) => {

  const inputStream = _(inputArray)

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {
    testOutput += testLine
  })

  await outputStream(outputPath, false, inputStream)

  stopStdoutcapture()
  
  t.is(
    testOutput,
    outputContent
  )
  
})

test.serial('outputStream inPlace true', async (t) => {

  const inputStream = _(inputArray)

  createFiles(inputFiles)

  await outputStream(outputPath, true, inputStream)

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent
  )

  removeFiles(outputFiles)
  
})

test.serial('outputStream inPlace string', async (t) => {

  const inputStream = _(inputArray)
  const inputExtension = '.backup';
  const inputPath = `${outputPath}${inputExtension}`;

  createFiles(inputFiles)

  await outputStream(outputPath, inputExtension, inputStream)

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent
  )

  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    inputContent
  )

  removeFile(outputPath)
  removeFile(inputPath)
  
})

test.serial('writeOutput file', async (t) => {

  const inputStream = _(inputArray)
  const intputWriteFileFn = writeFile(outputPath);

  createFiles(inputFiles)

  await writeOutput(inputStream, intputWriteFileFn)
  
  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent
  )

  removeFiles(outputFiles)

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