const _ = require('highland');
const rw = require('rw');

const readSource = () => {

  try {

    return rw.readFileSync('/dev/stdin', 'utf8');

  } catch (e) {

    return process.env;

  }

};

module.exports = {
  readSource
}