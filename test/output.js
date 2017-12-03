const test = require('ava');
const _ = require('highland');
const fs = require('fs');
const {
  writeFileStream
} = require('../lib/output');

const inputArray = [
  {
    lineText: '12cdefg',
    counts: {
      a: 1,
      b: 1
    }
  },
  {
    lineText: 'gf2dc2e2',
    counts: {
      b: 3
    }
  }
];

test('writeFile inPlace false', (t) => {

  const inputStream = _(inputArray)
  const path = './tmp/inplace_false.txt';

  writeFileStream(false, path, inputStream)
  .toArray(result => {

    t.deepEqual(
      result,
      inputArray
    )

  })

})

test('writeFile inPlace true', async (t) => {

  const inputStream = _(inputArray)
  const inputPath = './tmp/inplace_true.txt';
  const outputArray = [
    {
        a: 1,
        b: 1
      },
     {
        b: 3
      }
  ];

  const result = await writeFileStream(true, inputPath, inputStream)  

  t.deepEqual(
    outputArray,
    result
  )
  
  t.is(
    fs.readFileSync(inputPath, 'utf8'),
    '12cdefg\ngf2dc2e2'
  )

})