const rw = require('rw');
const R = require('ramda');

const readSource = () => {

  try {

    return parseStdin(rw.readFileSync('/dev/stdin', 'utf8'))

  } catch (e) {

    return process.env

  }

};

const parseStdin = R.pipe(
  R.split('\n'),
  R.map(R.split('=')),
  R.fromPairs()
)

const convertToReplaceMap = R.pipe(
  R.toPairs(),
  R.map(([key, value]) => [`\${${key}}`, value]),
  R.fromPairs()
)

const getReplacements = R.pipe(
  readSource,
  convertToReplaceMap,
)

module.exports = {
  readSource,
  parseStdin,
  convertToReplaceMap,
  getReplacements,
}