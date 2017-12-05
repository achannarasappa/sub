const test = require('ava');
const _ = require('highland');
const {
  replaceInStream,
  replaceAndCount,
  updateCounts,
} = require('../lib/replace');

const inputResult = {
  lineText: 'aaa bbb ccc 444',
  counts: {
    d: 3
  }
};

test('updateCounts new count', (t) => {

  t.deepEqual(updateCounts({}, '${a}'), {
    '${a}': 1
  })

})

test('updateCounts add count', (t) => {

  t.deepEqual(updateCounts({'${a}': 10}, '${a}'), {
    '${a}': 11
  })

})

test('replaceAndCount 3 replacements', (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2
  };
  const inputReplaceRegex = new RegExp('a|b', 'g');

  t.deepEqual(
    replaceAndCount(
      inputReplaceMap,
      inputReplaceRegex,
      'aaa bbb ccc ddd'
    ),
    {
      lineText: '111 222 ccc ddd',
      counts: {
        a: 3,
        b: 3
      }
    }
  )

})

test('replaceAndCount no replacements', (t) => {

  const inputReplaceMap = {
    e: 5
  };
  const inputReplaceRegex = new RegExp('e', 'g');

  t.deepEqual(
    replaceAndCount(
      inputReplaceMap,
      inputReplaceRegex,
      'aaa bbb ccc 444'
    ),
    {
      lineText: 'aaa bbb ccc 444',
      counts: {}
    }
  )

})

test('replaceInStream with replacements', async (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2
  };
  const intputReplaceRegex = new RegExp('a|b', 'g');
  const inputStream = _(['abcdefg\ngfbdcbeb'])

  await replaceInStream(
    inputReplaceMap,
    intputReplaceRegex,
    inputStream
  )
  .collect()
  .toPromise(Promise)
  .then(result => {

    t.deepEqual(
      result,
      [
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
      ]
    )

  })

  
})

test('replaceInStream no replacements', async (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2
  };
  const intputReplaceRegex = new RegExp('a|b', 'g');
  const inputStream = _(['trcdefg\ngfrdcrer'])

  await replaceInStream(
    inputReplaceMap,
    intputReplaceRegex,
    inputStream
  )
  .collect()
  .toPromise(Promise)
  .then(result => {

    t.deepEqual(
      result,
      [
        {
          lineText: 'trcdefg',
          counts: {}
        },
        {
          lineText: 'gfrdcrer',
          counts: {}
        }
      ]
    )

  })
  
})