#!/usr/bin/env node
const { substitute } = require('./main');
const { getReplaceMap } = require('./source');
const yargs = require('yargs');

yargs
  .command('*', 'Shell-esque parameter substitution in files from env and text data sources', (yargs) => {

    return yargs
    .option('in-place', {
      describe: 'Edit files in place',
      default: false,
    })
    .option('dry-run', {
      describe: 'Make no substitution',
      default: false,
    })
    .option('count-substitutions', {
      describe: 'Output substitution counts',
      default: false,
    })
    .alias('i', 'in-place')
    .alias('d', 'dry-run')
    .alias('c', 'count-substitutions')
    .alias('v', 'version')
    .alias('h', 'help')
    .example('sub **/*.json', 'Write replaced text to stdout')
    .example('sub **/*.json -i', 'Replace files in place')
    .example('sub **/*.json -i=.new', 'Replace in new file with suffix')
    .example('echo "A=1\\nB=2" | sub **/*.json', 'Replace from stdin source')
    .demandCommand(1, 'A file_pattern is required')
    .usage('sub <file_pattern> [options...]')
    .help()

  }, async ({
    _: filePatterns, inPlace, dryRun, countSubstitutions,
  }) => {

    try {

      const replaceMap = await getReplaceMap();

      return await substitute(filePatterns, replaceMap, inPlace, dryRun, countSubstitutions);

    } catch (e) {

      console.log(e.message);

    }

  })
  .argv;
