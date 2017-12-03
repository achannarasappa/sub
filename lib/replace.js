const R = require('ramda');
const _ = require('highland');
const fs = require('fs');

const replaceAndCount = R.curry((replaceMap, replaceRegex, lineText) => {
  
  let counts = {};
  const replacedLineText = R.replace(replaceRegex, (matchedText) => {
    
    counts = updateCounts(counts, matchedText)
    
    return R.prop(matchedText, replaceMap)
    
  }, lineText)
  
  return {
    lineText: replacedLineText,
    counts
  }

});

const updateCounts = (counts = {}, matchedText) => R.pipe(
  R.propOr(0, matchedText),
  R.add(1),
  R.assoc(matchedText)
)(counts)(counts)

module.exports = {
  replaceAndCount,
  updateCounts,
}