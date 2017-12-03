const test = require('ava');
const _ = require('highland');
const {
  execFunction
} = require('./_util')
const {
  readSource
} = require('../lib/source');

test('readSource', async (t) => {

  const inputStdin = [
    'TEST1=replace1',
    'TEST2=replace2',
    'TEST3=replace3',
  ].join('\n');

  const testResult = execFunction(
    './lib/source',
    'readSource',
    inputStdin
  )
  
  t.is(
    testResult,
    inputStdin
  )

})