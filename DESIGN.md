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
- source variables from a json file
- source variables from a text file
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
far file.txt
# Replace in place
far -i file.txt
# Replace in all text files appending a suffix to original files
far -i ".backup" "./*.txt"
# Replace with json file contents as source
far -s replacements.json file.txt
# Replace with stdin as source
gpg --decrypt secrets.gpg | far file.txt
# Verbose logging
far -v -i "./*.txt"
```
