# sub
[![Build Status](https://travis-ci.org/achannarasappa/sub.svg?branch=master)](https://travis-ci.org/achannarasappa/sub) [![Coverage Status](https://coveralls.io/repos/github/achannarasappa/sub/badge.svg?branch=master)](https://coveralls.io/github/achannarasappa/sub?branch=master)

## Installation
#### NPM
```sh
npm install -g subjs
```

## Usage
```sh
sub <file_pattern> [options...]

Shell-esque parameter substitution in files from env and text data sources

Positionals:
  file_pattern  file glob pattern e.g. *.json                           [string]

Options:
  -i, --in-place             Edit files in place                [default: false]
  -d, --dry-run              Make no substitution               [default: false]
  -c, --count-substitutions  Output substitution counts         [default: false]
  -v, --version              Show version number                       [boolean]
  -h, --help                 Show help                                 [boolean]
```

## Examples
#### Pipe in replacements, get substituted file contents to stdout
```sh
echo 'Hello my name is ${USER}\nI live in ${HOME}' > greeting.txt
echo 'USER=rob\nHOME=philadelphia' | sub greeting.txt
# Hello my name is rob
# I live in philadelphia
```
#### Substitute environment variables in files and count replacements
```sh
echo 'Hello my name is ${USER}\nI live in ${HOME}' > greeting.txt
echo '${USER} speaks ${LANGUAGE}' > language.txt
env | grep 'USER\|LANGUAGE\|HOME'
# USER=ani
# HOME=/home/ani
# LANGUAGE=en_US
sub *.txt --in-place --count-substitution
# greeting.txt
#  USER: 1
#  HOME: 1
# language.txt
#  USER: 1
#  LANGUAGE: 1
cat greeting.txt
# Hello my name is ani
# I live in /home/ani
cat language.txt
# ani speaks en_US
```

## Contributions
PRs welcome :)