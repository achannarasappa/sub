const shell = require('shelljs');
const R = require('ramda');

const execFunction = (file, func, stdin, funcArgs = []) => {
  
  const runner = [
    `const {${func}} = require('${file}');`,
    `(async () => console.log(await ${func}(${funcArgs.join(',')})))()`
  ].join('')

  const command = shell.exec(`echo "${stdin}" | node -e "${runner}"`)
  const stdoutLengthWithoutNewline = command.stdout.length - 2

  return R.take(stdoutLengthWithoutNewline, command.stdout)

};

module.exports = {
  execFunction
};