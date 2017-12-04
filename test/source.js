const test = require('ava');
const _ = require('highland');
const R = require('ramda');
const {
  execFunction
} = require('./_util')
const {
  readSource,
  parseStdin,
  convertToReplaceMap,
  createReplaceRegex
} = require('../lib/source');

const inputMap = {
  'TEST1': 'replace1',
  'TEST2': 'replace2',
  'TEST3': 'replace3',
}
const outputReplaceMap = {
  '${TEST1}': 'replace1',
  '${TEST2}': 'replace2',
  '${TEST3}': 'replace3',
}
const outputReplaceRegex = new RegExp('${TEST1}|${TEST2}|${TEST3}', 'g');
const inputStdin = R.pipe(
  R.toPairs(),
  R.map(R.join('=')),
  R.join('\n')
)(inputMap)


test('readSource stdin', (t) => {

  const testResult = execFunction(
    './lib/source',
    'readSource',
    [],
    `echo "${inputStdin}" | `
  )
  const testResultParsed = JSON.parse(testResult)
  
  t.deepEqual(
    testResultParsed,
    inputMap
  )

})

test('readSource env', (t) => {

  const inputEnvString = R.pipe(
    R.toPairs(),
    R.map(R.join('=')),
    R.join(' ')
  )(inputMap)
  
  const inputEnvKeys = R.keys(inputMap)

  const testResult = execFunction(
    './lib/source',
    'readSource',
    [],
    `env ${inputEnvString} `
  )
  const testResultParsed = JSON.parse(testResult)
  
  t.deepEqual(
    R.pick(inputEnvKeys, testResultParsed),
    inputMap,
  )

})

test('parseStdin', (t) => {

  const testResult = parseStdin(inputStdin)

  t.deepEqual(
    testResult,
    inputMap,
  )
  
})

test('convertToReplaceMap', (t) => {

  const testResult = convertToReplaceMap(inputMap)

  t.deepEqual(
    testResult,
    outputReplaceMap
  )
  
})

test('createReplaceRegex', (t) => {

  const testResult = createReplaceRegex(outputReplaceMap)

  t.deepEqual(
    testResult,
    outputReplaceRegex
  )

})

test.todo('readSource stdin error')