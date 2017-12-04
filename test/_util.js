const shell = require('shelljs');
const R = require('ramda');

const execFunction = (file, func, funcArgs = [], commandPrefix = '') => {
  
  const script = [
    `const {${func}} = require('${file}');`,
    `(async () => process.stdout.write(JSON.stringify(await ${func}(${funcArgs.join(',')}))))()`
  ].join('')
  
  const command = `${commandPrefix} node -e "${script}"`
  
  const result = shell.exec(command, { silent: true })

  if (result.stderr)
    console.log(result.stderr);

  return result.stdout

};

module.exports = {
  execFunction
};