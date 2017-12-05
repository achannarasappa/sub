const R = require('ramda');
const _ = require('highland');

const replaceInStream = R.curry((replaceMap, replaceRegex, stream) => {
  
  return stream
  .split()
  .map(replaceAndCount(replaceMap, replaceRegex))

});

const replaceAndCount = R.curry((replaceMap, replaceRegex, lineText) => {
 
  return R.pipe(
    R.toPairs(),
    R.reduce((acc, [searchText, replaceText]) => {
      
      const splitLineText = R.split(searchText, acc.lineText)
      const replaceCount = splitLineText.length - 1


      return {
        lineText: R.join(replaceText, splitLineText),
        counts: updateCounts(searchText, replaceCount, acc.counts)
      }

    }, {lineText, counts: {}})
  )(replaceMap)

});

const updateCounts = (searchText, increment, counts) => {

  if (increment > 0)
    return R.pipe(
      R.propOr(0, searchText),
      R.add(increment),
      R.assoc(searchText)
    )(counts)(counts)

  return counts

}

module.exports = {
  replaceInStream,
  replaceAndCount,
  updateCounts,
}