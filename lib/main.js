const { inputStream } = require('./input')
const { replaceInStream } = require('./replace')
const { outputStream, convertToFileReplacementCounts } = require('./output')

const findAndReplace = async (filePattern, replaceMap, inPlace = false) => {

  return await inputStream(filePattern)
  .map(async ({ stream, path }) => {

    return await replaceInStream(replaceMap, stream)
    .through(s => outputStream(path, inPlace, s))
    .then((counts) => ({ counts, path }))

  })
  .collect()
  .toPromise(Promise)
  .then((promises) => Promise.all(promises))
  .then(convertToFileReplacementCounts)

};

module.exports = {
  findAndReplace
}