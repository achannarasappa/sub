const R = require('ramda');
const _ = require('highland');
const fs = require('fs-extra');
const tmp = require('tmp');
const { render } = require('prettyjson');

const outputStream = R.curry(async (path, inPlace = true, dryRun = false, stream) => {

  if (dryRun)
    return writeOutput(stream, writeDevNull);

  if (R.is(String, inPlace))
    await fs.copy(path, `${path}${inPlace}`);

  if (inPlace)
    return writeOutput(stream, writeFile(path));

  return writeOutput(stream, writeStdout);

});

const writeDevNull = R.curry((successResult, stream) => new Promise((resolve, reject) => {

  stream
    .done((s) => s);

  resolve(successResult);

}));

const writeStdout = R.curry((successResult, stream) => new Promise((resolve, reject) => {

  stream
    .pipe(process.stdout);

  resolve(successResult);

}));

const writeOutput = (stream, outputFn = writeStdout) => {

  const writeStream = stream
    .fork();
  const counts = stream
    .fork()
    .through(gatherCounts);

  return writeStream
    .map(R.prop('lineText'))
    .intersperse('\n')
    .through(outputFn(counts));

};

const writeFile = R.curry((path, successResult, stream) => new Promise((resolve, reject) => {

  const { name: tempPath } = tmp.fileSync();

  return stream
    .pipe(fs.createWriteStream(tempPath, 'utf8'))
    .on('close', async () => {

      try {

        await fs.move(tempPath, path, { overwrite: true });
        resolve(successResult);

      } catch (err) {

        reject(err);

      }

    })
    .on('error', (err) => reject(err));

}));

const printCounts = R.curry((countSubstitutions, counts) => {

  if (countSubstitutions)
    console.log(render(counts));

  return counts;

});

const gatherCounts = (stream) => stream
  .map(R.prop('counts'))
  .reduce({}, R.mergeWith(R.add))
  .toPromise(Promise);

const convertFromReplaceMap = R.pipe(
  R.toPairs,
  R.map(([k, v]) => [R.drop(2, R.dropLast(1, k)), v]),
  R.fromPairs,
);

const convertToFileReplacementCounts = R.reduce(
  (acc, {
    path, counts,
  }) => R.assoc(path, convertFromReplaceMap(counts), acc),
  {},
);

module.exports = {
  convertFromReplaceMap,
  convertToFileReplacementCounts,
  outputStream,
  writeOutput,
  writeFile,
  writeStdout,
  gatherCounts,
  printCounts,
};
