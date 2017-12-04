const rw = require('rw');
const R = require('ramda');

const readSource = () => {

  try {

    return R.pipe(
      parseStdin,
      convertToReplaceMap
    )(rw.readFileSync('/dev/stdin', 'utf8'))

  } catch (e) {

    return convertToReplaceMap(process.env);

  }

};

const parseStdin = (stdin) => {

  return R.pipe(
    R.split('\n'),
    R.map(R.split('=')),
    R.fromPairs()
  )(stdin)

};

const convertToReplaceMap = (replaceMap) => {

  return R.pipe(
    R.toPairs(),
    R.map(([key, value]) => [`\${${key}}`, value]),
    R.fromPairs()
  )(replaceMap)

};

module.exports = {
  readSource,
  parseStdin,
  convertToReplaceMap
}