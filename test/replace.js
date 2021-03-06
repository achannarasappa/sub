/* eslint-disable no-template-curly-in-string */
const test = require('ava');
const _ = require('highland');
const {
  replaceInStream,
  replaceAndCount,
  updateCounts,
} = require('../lib/replace');

test('updateCounts new count', (t) => {

  t.deepEqual(updateCounts('${a}', 1, {}), { '${a}': 1 });

});

test('updateCounts add count', (t) => {

  t.deepEqual(updateCounts('${a}', 1, { '${a}': 10 }), { '${a}': 11 });

});

test('replaceAndCount 3 replacements', (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2,
  };

  t.deepEqual(
    replaceAndCount(
      inputReplaceMap,
      'aaa bbb ccc ddd',
    ),
    {
      lineText: '111 222 ccc ddd',
      counts: {
        a: 3,
        b: 3,
      },
    },
  );

});

test('replaceAndCount no replacements', (t) => {

  const inputReplaceMap = { e: 5 };

  t.deepEqual(
    replaceAndCount(
      inputReplaceMap,
      'aaa bbb ccc 444',
    ),
    {
      lineText: 'aaa bbb ccc 444',
      counts: {},
    },
  );

});

test('replaceInStream with replacements', async (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2,
  };
  const inputStream = _(['abcdefg\ngfbdcbeb']);

  await replaceInStream(
    inputReplaceMap,
    inputStream,
  )
    .collect()
    .toPromise(Promise)
    .then((result) => {

      t.deepEqual(
        result,
        [{
          lineText: '12cdefg',
          counts: {
            a: 1,
            b: 1,
          },
        }, {
          lineText: 'gf2dc2e2',
          counts: { b: 3 },
        }],
      );

    });

});

test('replaceInStream no replacements', async (t) => {

  const inputReplaceMap = {
    a: 1,
    b: 2,
  };
  const inputStream = _(['trcdefg\ngfrdcrer']);

  await replaceInStream(
    inputReplaceMap,
    inputStream,
  )
    .collect()
    .toPromise(Promise)
    .then((result) => {

      t.deepEqual(
        result,
        [{
          lineText: 'trcdefg',
          counts: {},
        }, {
          lineText: 'gfrdcrer',
          counts: {},
        }],
      );

    });

});
