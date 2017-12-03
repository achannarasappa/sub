const R = require('ramda');
const _ = require('highland');
var fs = require('fs');

const writeFileStream = (inPlace, path, stream) => {

  if (inPlace === false)
    return stream

  if (inPlace === true)
    return writeFile(path, stream)
  
};

const writeFile = (path, stream) => new Promise((resolve, reject) => {

  const writeStream = stream.fork();
  const passthroughStream = stream
  .fork()
  .map(R.prop('counts'))
  .collect()
  .toPromise(Promise)

  writeStream
  .map(R.prop('lineText'))
  .intersperse('\n')
  .pipe(fs.createWriteStream(path, 'utf8'))
  .on('close', () => {    
    resolve(passthroughStream)
  })
  .on('error', (err) => reject(err))

});

module.exports = {
  writeFileStream
}