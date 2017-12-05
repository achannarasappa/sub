const _ = require('highland');
const glob = require('glob');
const fs = require('fs');
const readFile = _.wrapCallback(fs.readFile);

const inputStream = (filePattern) => {
  
  const paths = glob.sync(filePattern)

  return _(paths)
  .map(stream =>
    readFile(stream)
    .invoke('toString', ['utf8'])
  )

};

module.exports = {
  inputStream,
}