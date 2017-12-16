## Motivation
- storing encrypted secrets in source control. needed to be able to replace multiple decrypted secrets in multiple files
- did not want to alter a script when new secrets need to be added
- systems, languages, and packages all have different ways to handle secret substitution

## Goals
- replace multiple variables in multiple text files
- no scripting required
- run (almost) anywhere
- interoperability with linux toolchain and command line workflows

## Features
- source variables from environment
- source variables from stdin
- bash variable substitution syntax
- recursively replace files patterns in place
- in-place edit flag

## Alternatives
- sed, awk
- envsubst
- write a script

## Interface
```bash
# Replace environment variables in file and output to stdout
sub file.txt
# Replace in place
sub -i file.txt
# Replace in all text files appending a suffix to original files
sub -i ".backup" "./*.txt"
# Replace with stdin as source
gpg --decrypt secrets.gpg | sub file.txt
# Replace and output replacement statistics
sub -v -i "./*.txt"
# Output replacement statistics only
sub -v -q "./*.txt"
```

## Process Sequence
- read input files
  - get array of all files
  - create readable stream for each file
- read replacements
  - if stdin, read stdin else read env
  - split input on `=` and `\n`
  - unique
- make replacements
  - replace variable in text
  - track instance replace count per variable
- output replacements
  - file output
    - if `-i` write to disk
    - if `-q` no output
    - if no flags to stdout
  - summary
    - if `-v` output replacement statistics per file