const _ = require('highland');
const glob = require('glob');
const fs = require('fs');
const R = require('ramda');
const readFile = _.wrapCallback(fs.readFile);

const inputStream = (filePatterns) => {
  
  const paths = R.chain(glob.sync, filePatterns)

  return _(paths)
  .map((path) => {

    const stream = readFile(path)
    .invoke('toString', ['utf8'])

    return {
      stream,
      path
    }

  })

};

module.exports = {
  inputStream,
}