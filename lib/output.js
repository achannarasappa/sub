const R = require('ramda');
const _ = require('highland');
var fs = require('fs');

const outputStream = (path, stream, inPlace = true) => {

  if (inPlace === false)
    return stream

  if (inPlace === true)
    return writeFile(path, stream)
  
};

const writeFile = R.curry((path, stream) => new Promise((resolve, reject) => {

  const writeStream = stream
  .fork();
  const counts = stream
  .fork()
  .through(gatherCounts)

  return writeStream
  .map(R.prop('lineText'))
  .intersperse('\n')
  .pipe(fs.createWriteStream(path, 'utf8'))
  .on('close', () => {    
    resolve(counts)
  })
  .on('error', (err) => reject(err))

}));

const gatherCounts = (stream) => {

  return stream
  .map(R.prop('counts'))
  .collect()
  .toPromise(Promise)

};

module.exports = {
  writeFile
}