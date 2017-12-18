const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const R = require('ramda');
const colors = require('colors');
const interceptStdout = require('intercept-stdout');
const {
  removeFile,
  removeFiles,
  createFiles,
} = require('./_util');
const {
  convertFromReplaceMap,
  convertToFileReplacementCounts,
  outputStream,
  writeOutput,
  writeFile,
  writeStdout,
  gatherCounts,
  printCounts,
} = require('../lib/output');

const inputArray = [{
  lineText: '12cdefg',
  counts: {
    a: 1,
    b: 1,
  },
}, {
  lineText: 'gf2dc2e2',
  counts: { b: 3 },
}];
const outputContent = '12cdefg\ngf2dc2e2';
const outputPath = './tmp/output-test.txt';
const outputFiles = [{
  path: outputPath,
  content: outputContent,
}];
const inputContent = R.pipe(R.pluck('lineText'), R.join('\n'))(inputArray);
const inputFiles = [{
  path: outputFiles[0].path,
  content: inputContent,
}];
const inputFileReplacementCounts = [{
  path: '/tmp/test_1.json',
  counts: {
    '${a}': 100,
    '${b}': 200,
  },
}, {
  path: '/tmp/test_2.json',
  counts: {
    '${c}': 10,
    '${b}': 20,
  },
}];
const outputFileReplacementCount = {
  '/tmp/test_1.json': {
    a: 100,
    b: 200,
  },
  '/tmp/test_2.json': {
    c: 10,
    b: 20,
  },
};
const outputTerminalCounts = [
  '/tmp/test_1.json: '.green,
  `  ${'a: '.green}${'100'.blue}`,
  `  ${'b: '.green}${'200'.blue}`,
  '/tmp/test_2.json: '.green,
  `  ${'c: '.green}${'10'.blue}`,
  `  ${'b: '.green}${'20'.blue}`,
  '',
].join('\n');

test('outputStream dryRun true', async (t) => {

  const inputStream = _(inputArray);

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {

    testOutput += testLine;

  });

  createFiles(inputFiles);

  await outputStream(outputPath, false, true, inputStream);

  const testFileContents = fs.readFileSync(outputPath, 'utf8');

  stopStdoutcapture();

  t.is(
    testOutput,
    '',
  );

  t.is(
    inputContent,
    testFileContents,
  );

  removeFiles(outputFiles);

});

test('outputStream inPlace false', async (t) => {

  const inputStream = _(inputArray);

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {

    testOutput += testLine;

  });

  await outputStream(outputPath, false, false, inputStream);

  stopStdoutcapture();

  t.is(
    testOutput,
    outputContent,
  );

});

test('outputStream inPlace true', async (t) => {

  const inputStream = _(inputArray);

  createFiles(inputFiles);

  await outputStream(outputPath, true, false, inputStream);

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent,
  );

  removeFiles(outputFiles);

});

test('outputStream inPlace string', async (t) => {

  const inputStream = _(inputArray);
  const inputExtension = '.backup';
  const inputPath = `${outputPath}${inputExtension}`;

  createFiles(inputFiles);

  await outputStream(outputPath, inputExtension, false, inputStream);

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent,
  );

  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    inputContent,
  );

  removeFile(outputPath);
  removeFile(inputPath);

});

test('writeOutput file', async (t) => {

  const inputStream = _(inputArray);
  const intputWriteFileFn = writeFile(outputPath);

  createFiles(inputFiles);

  await writeOutput(inputStream, intputWriteFileFn);

  t.is(
    fs.readFileSync(outputPath, 'utf8'),
    outputContent,
  );

  removeFiles(outputFiles);

});

test('writeOutput file error', async (t) => {

  const inputStream = _(inputArray);
  const inputPath = 'tmp//';
  const intputWriteFileFn = writeFile(inputPath);

  const testError = await t.throws(writeOutput(inputStream, intputWriteFileFn), Error);

  t.is(
    testError.message,
    'EISDIR: illegal operation on a directory, open \'tmp//\'',
  );

});

test('gatherCounts', async (t) => {

  const inputStream = _(inputArray);

  t.deepEqual(
    await inputStream
      .through(gatherCounts),
    {
      a: 1,
      b: 4,
    },
  );

});

test('writeOutput stdout', async (t) => {

  const inputStream = _(inputArray);

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {

    testOutput += testLine;

  });

  await writeOutput(inputStream);

  stopStdoutcapture();

  t.is(
    testOutput,
    outputContent,
  );

});

test('convertToFileReplacementCounts', (t) => {

  t.deepEqual(
    convertToFileReplacementCounts(inputFileReplacementCounts),
    outputFileReplacementCount,
  );

});

test('printCounts terminal output', (t) => {

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {

    testOutput += testLine;

  });

  const testResult = printCounts(true, outputFileReplacementCount);

  stopStdoutcapture();

  t.deepEqual(
    testResult,
    outputFileReplacementCount,
  );

  t.deepEqual(
    testOutput,
    outputTerminalCounts,
  );

});

test('printCounts passthrough', (t) => {

  let testOutput = '';
  const stopStdoutcapture = interceptStdout((testLine) => {

    testOutput += testLine;

  });

  const testResult = printCounts(false, outputFileReplacementCount);

  stopStdoutcapture();

  t.deepEqual(
    testResult,
    outputFileReplacementCount,
  );

  t.deepEqual(
    testOutput,
    '',
  );

});
