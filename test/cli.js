const test = require('ava');
const shell = require('shelljs');
const {
  createFiles,
  removeFiles,
  readFiles,
} = require('./_util');
const {
  inputFiles,
  outputContents,
  outputTerminalCounts,
  inputReplaceText,
  inputContents,
} = require('./_fixtures');
const R = require('ramda');

test.beforeEach((t) => createFiles(inputFiles));

test('file glob literal', (t) => {

  shell.exec(`echo "${inputReplaceText}" | node ./lib/cli.js tmp/*.json -i`, { silent: true });

  t.deepEqual(
    readFiles(inputFiles),
    outputContents,
  );

});

test('file glob string', (t) => {

  shell.exec(`echo "${inputReplaceText}" | node ./lib/cli.js "tmp/*.json" -i`, { silent: true });

  t.deepEqual(
    readFiles(inputFiles),
    outputContents,
  );

});
test('in-place with file rename', (t) => {

  shell.exec(`echo "${inputReplaceText}" | node ./lib/cli.js "tmp/*.json" -i ".backup"`, { silent: true });
  const testFiles = R.map((file) => R.assoc('path', `${file.path}.backup`, file), inputFiles);

  t.deepEqual(
    readFiles(inputFiles),
    outputContents,
  );

  t.deepEqual(
    readFiles(testFiles),
    R.pluck('content', testFiles),
  );

});

test('in-place with count', (t) => {

  const { stdout } = shell.exec(`echo "${inputReplaceText}" | node ./lib/cli.js "tmp/*.json" -c -i`, { silent: true });

  t.deepEqual(
    stdout,
    outputTerminalCounts,
  );

  t.deepEqual(
    readFiles(inputFiles),
    outputContents,
  );

});

test('dry run with count', (t) => {

  const { stdout } = shell.exec(`echo "${inputReplaceText}" | node ./lib/cli.js "tmp/*.json" -c -d`, { silent: true });

  t.deepEqual(
    stdout,
    outputTerminalCounts,
  );

  t.deepEqual(
    readFiles(inputFiles),
    inputContents,
  );

});

// TODO: Revisit after avajs is replaced. Might be related to avajs stdio issue
// https://github.com/avajs/ava/issues/1322
test.skip('env source', (t) => {

  const { stdout } = shell.exec(`env ${inputReplaceText} node ./lib/cli.js "tmp/*.json" -c -d`, { silent: true });

  t.deepEqual(
    stdout,
    outputTerminalCounts,
  );

  t.deepEqual(
    readFiles(inputFiles),
    inputContents,
  );

});

test.afterEach((t) => removeFiles(inputFiles));
