const R = require('ramda');
const _ = require('highland');
var fs = require('fs');

const outputStream = R.curry(async (path, inPlace = true, stream) => {

  if (inPlace === true)
    return writeOutput(stream, writeFile(path))

  if (R.is(String, inPlace))
    return writeOutput(stream, writeFile(`${path}${inPlace}`))

  return writeOutput(stream, writeStdout)
  
});

const writeStdout = R.curry((successResult, stream) => new Promise((resolve, reject) => {
  
    stream
    .pipe(process.stdout)
  
    resolve(successResult)
    
  }));

const writeOutput = (stream, outputFn = writeStdout) => {

  const writeStream = stream
  .fork();
  const counts = stream
  .fork()
  .through(gatherCounts)

  return writeStream
  .map(R.prop('lineText'))
  .intersperse('\n')
  .through(outputFn(counts))

};

const writeFile =  R.curry((path, successResult, stream) => new Promise((resolve, reject) => {

  stream
  .pipe(fs.createWriteStream(path, 'utf8'))
  .on('close', () => {    
    resolve(successResult)
  })
  .on('error', (err) => reject(err))
  
}));

const gatherCounts = (stream) => {

  return stream
  .map(R.prop('counts'))
  .reduce({}, R.mergeWith(R.add))
  .toPromise(Promise)

};

const convertFromReplaceMap = R.pipe(
  R.toPairs,
  R.map(([k,v]) => [R.drop(2, R.dropLast(1, k)), v]),
  R.fromPairs
)

const convertToFileReplacementCounts = R.reduce(
  (acc, { path, counts }) => R.assoc(path, convertFromReplaceMap(counts), acc),
  {}
)

module.exports = {
  convertFromReplaceMap,
  convertToFileReplacementCounts,
  outputStream,
  writeOutput,
  writeFile,
  writeStdout,
  gatherCounts
}