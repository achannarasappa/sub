const { inputStream } = require('./input')
const { replaceInStream } = require('./replace')
const { outputStream, convertToFileReplacementCounts, printCounts } = require('./output')

const substitute = async (filePattern, replaceMap, inPlace = false, dryRun = false, countSubstitutions = false) => {

  return await inputStream(filePattern)
  .map(async ({ stream, path }) => {
    
    return await replaceInStream(replaceMap, stream)
    .through(s => outputStream(path, inPlace, dryRun, s))
    .then((counts) => ({ counts, path }))

  })
  .collect()
  .toPromise(Promise)
  .then((promises) => Promise.all(promises))
  .then(convertToFileReplacementCounts)
  .then(printCounts(countSubstitutions))

};

module.exports = {
  substitute
}