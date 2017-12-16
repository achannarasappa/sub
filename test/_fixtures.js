const colors = require('colors');
const { join } = require('path');
const R = require('ramda');
const getPath = (i) => join('tmp', `test-${i}.json`)

module.exports = {
  inputFiles: [
    {
      path: getPath(1),
      content: '1foo${bar}',
    },
    {
      path: getPath(2),
      content: '2foo${bar}${bar}',
    },
    {
      path: getPath(3),
      content: '3foo${bar}${bar}${bar}',
    },
  ],
  inputReplaceMap: { '${bar}': 'baz' },
  inputContents: [
    '1foo${bar}',
    '2foo${bar}${bar}',
    '3foo${bar}${bar}${bar}',
  ],
  inputReplaceText: 'bar=baz',
  outputCounts: R.fromPairs(R.map((v) => [ getPath(v), { bar: v } ], R.range(1, 4))),
  outputContents: [
    '1foobaz',
    '2foobazbaz',
    '3foobazbazbaz',
  ],
  outputTerminalCounts: [
    `${getPath(1)}: `,
    '  bar: 1',
    `${getPath(2)}: `,
    '  bar: 2',
    `${getPath(3)}: `,
    '  bar: 3',
    '',
  ].join('\n'),
};
