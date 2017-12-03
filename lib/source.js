const _ = require('highland');
const getStdin = require('get-stdin');

const readSource = async () => {

  const stdin = await getStdin()

  return stdin;

};

module.exports = {
  readSource
}