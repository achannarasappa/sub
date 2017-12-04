const test = require('ava');
const _ = require('highland');
const R = require('ramda');
const {
  execFunction
} = require('./_util')
const {
  readSource,
  parseStdin
} = require('../lib/source');

const inputEnv = {
  'TEST1': 'replace1',
  'TEST2': 'replace2',
  'TEST3': 'replace3',
}
const inputStdin = R.pipe(
  R.toPairs(),
  R.map(R.join('=')),
  R.join('\n')
)(inputEnv)


test('readSource stdin', (t) => {

  const testResult = execFunction(
    './lib/source',
    'readSource',
    [],
    `echo "${inputStdin}" | `
  )
  const testResultParsed = R.pipe(
    JSON.parse,
  )(testResult)
  
  t.deepEqual(
    testResultParsed,
    inputEnv
  )

})

test('readSource env', (t) => {

  const inputEnvString = R.pipe(
    R.toPairs(),
    R.map(R.join('=')),
    R.join(' ')
  )(inputEnv)
  
  const inputEnvKeys = R.keys(inputEnv)

  const testResult = execFunction(
    './lib/source',
    'readSource',
    [],
    `env ${inputEnvString} `
  )
  const testResultParsed = JSON.parse(testResult)
  
  t.deepEqual(
    R.pick(inputEnvKeys, testResultParsed),
    inputEnv,
  )

})

test.todo('readSource stdin error')

test('parseStdin', (t) => {

  const testResult = parseStdin(inputStdin)

  t.deepEqual(
    testResult,
    inputEnv,
  )

  
})