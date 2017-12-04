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

const createReplaceRegex = R.pipe(
  R.keys,
  R.join('|'),
  (regex) => new RegExp(regex, 'g')
)

const createReplacements = (replaceMap) => ({
  replaceMap,
  replaceRegex: createReplaceRegex(replaceMap)
})

const getReplacements = R.pipe(
  readSource,
  convertToReplaceMap,
  createReplacements
)

module.exports = {
  readSource,
  parseStdin,
  convertToReplaceMap,
  createReplaceRegex,
  getReplacements,
}