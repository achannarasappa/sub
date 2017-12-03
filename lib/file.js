const R = require('ramda');
const _ = require('highland');
var fs = require('fs');

const writeFileStream = (inPlace, path, stream) => {

  if (inPlace === false)
    return stream
    
  // const fileSteam = fs.createWriteStream(path, 'utf8');

  if (inPlace === true)
    return writeFile(path, stream)

  // return passthroughStream
  
};

const writeFile = (path, stream) => new Promise((resolve, reject) => {

  const writeStream = stream.fork();
  const passthroughStream = stream
  .fork()
  .map(R.dissoc('lineText'))
  .collect()
  .toPromise(Promise)

  writeStream
  .map(R.prop('lineText'))
  .intersperse('\n')
  .tap(console.log)
  .pipe(fs.createWriteStream(path, 'utf8'))
  .on('close', () => {    
    resolve(passthroughStream)
  })
  .on('error', (err) => reject(err))

});

// const writeFile = (path, stream) => {

//   const writeStream = stream
//   .map(R.prop('lineText'))
//   .intersperse('\n')
//   .pipe(fs.createWriteStream(path, 'utf8'))
//   // .on('close', (err) => passthroughStream.end())
//   const passthroughStream = stream
//   .map(R.dissoc('lineText'))
  
//   // .tap(console.log)

//   return passthroughStream

// };

module.exports = {
  writeFileStream
}