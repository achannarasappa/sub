const _ = require('highland');
const glob = require('glob');
const fs = require('fs');
const readFile = _.wrapCallback(fs.readFile);

const inputStream = (filePattern) => {
  
  const paths = glob.sync(filePattern)

  // TODO: Update test
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