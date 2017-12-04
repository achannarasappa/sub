const rw = require('rw');
const R = require('ramda');

const getReplacements = () => {
  
  return R.pipe(
    readSource,
    convertToReplaceMap,
    createReplacements,
  )
  
};

const readSource = () => {

  try {

    return parseStdin(rw.readFileSync('/dev/stdin', 'utf8'))

  } catch (e) {

    return process.env

  }

};

const parseStdin = (stdin) => {

  return R.pipe(
    R.split('\n'),
    R.map(R.split('=')),
    R.fromPairs()
  )(stdin)

};

const convertToReplaceMap = (map) => {

  return R.pipe(
    R.toPairs(),
    R.map(([key, value]) => [`\${${key}}`, value]),
    R.fromPairs()
  )(map)

};

const createReplaceRegex = (replaceMap) => {

  return R.pipe(
    R.keys,
    R.join('|'),
    (regex) => new RegExp(regex, 'g')
  )(replaceMap)
  
};

const createReplacements = (replaceMap) => ({
  replaceMap,
  replaceRegex: createReplaceRegex(replaceMap)
})

module.exports = {
  readSource,
  parseStdin,
  convertToReplaceMap,
  createReplaceRegex,
}