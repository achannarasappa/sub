const colors = require('colors')

module.exports = {
  inputFiles: [
    {
      path: './tmp/test-1.json',
      content: '1foo${bar}'
    },
    {
      path: './tmp/test-2.json',
      content: '2foo${bar}${bar}'
    },
    {
      path: './tmp/test-3.json',
      content: '3foo${bar}${bar}${bar}'
    },
  ],
  inputReplaceMap: {
    '${bar}': 'baz'
  },
  inputContents: [
    '1foo${bar}',
    '2foo${bar}${bar}',
    '3foo${bar}${bar}${bar}',
  ],
  inputReplaceText: 'bar=baz',
  outputCounts: {
    './tmp/test-1.json': {
      bar: 1
    },
    './tmp/test-2.json': {
      bar: 2
    },
    './tmp/test-3.json': {
      bar: 3
    },
  },
  outputContents: [
    '1foobaz',
    '2foobazbaz',
    '3foobazbazbaz',
  ],
  outputTerminalCounts: [
    'tmp/test-1.json: ',
    '  bar: 1',
    'tmp/test-2.json: ',
    '  bar: 2',
    'tmp/test-3.json: ',
    '  bar: 3',
    '',
  ].join('\n'),
}