const R = require('ramda');
const getStdin = require('get-stdin');

const readSource = async () => {

  const stdin = await getStdin()

  if (stdin)
    return parseStdin(stdin)

  return process.env

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

const getReplaceMap = R.pipeP(
  readSource,
  convertToReplaceMap,
)

module.exports = {
  readSource,
  parseStdin,
  convertToReplaceMap,
  getReplaceMap,
}