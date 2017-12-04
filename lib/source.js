const rw = require('rw');
const R = require('ramda');

const readSource = () => {

  try {

    return parseStdin(rw.readFileSync('/dev/stdin', 'utf8'))

  } catch (e) {

    return process.env;

  }

};

const parseStdin = (stdin) => {

  return R.pipe(
    R.split('\n'),
    R.map(R.split('=')),
    R.fromPairs()
  )(stdin)

};

module.exports = {
  parseStdin,
  readSource
}