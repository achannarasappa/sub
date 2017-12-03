const R = require('ramda');
const _ = require('highland');
var fs = require('fs');

const outputStream = (path, stream, inPlace = true) => {

  if (inPlace === false)
    return stream

  if (inPlace === true)
    return writeFile(path, stream)
  
};

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

module.exports = {
  writeOutput,
  writeFile,
  writeStdout,
  gatherCounts
}