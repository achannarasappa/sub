const R = require('ramda');

const updateCounts = (searchText, increment, counts) => {

  if (increment > 0)
    return R.pipe(
      R.propOr(0, searchText),
      R.add(increment),
      R.assoc(searchText),
    )(counts)(counts);

  return counts;

};

const replaceAndCount = R.curry((replaceMap, lineText) => R.pipe(
  R.toPairs(),
  R.reduce((acc, [searchText, replaceText]) => {

    const splitLineText = R.split(searchText, acc.lineText);
    const replaceCount = splitLineText.length - 1;

    return {
      lineText: R.join(replaceText, splitLineText),
      counts: updateCounts(searchText, replaceCount, acc.counts),
    };

  }, {
    lineText, counts: {},
  }),
)(replaceMap));

const replaceInStream = R.curry((replaceMap, stream) => stream
  .split()
  .map(replaceAndCount(replaceMap)));

module.exports = {
  replaceInStream,
  replaceAndCount,
  updateCounts,
};
