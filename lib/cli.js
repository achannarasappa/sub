const { substitute } = require('./main');
const { getReplaceMap } = require('./source');
const yargs = require('yargs');

yargs
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
  .help()
  .command('*', 'Shell-esque parameter substitution in files from env and text data sources', () => {}, async ({
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
