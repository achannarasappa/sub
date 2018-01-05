# sub
[![Build Status](https://travis-ci.org/achannarasappa/sub.svg?branch=master)](https://travis-ci.org/achannarasappa/sub) [![Coverage Status](https://coveralls.io/repos/github/achannarasappa/sub/badge.svg?branch=master)](https://coveralls.io/github/achannarasappa/sub?branch=master)

Shell-esque parameter substitution in files from env and stdin replacement sources

## Features
* In-place multi-file edits (`sed`'s `-i` option)
* Substitution count and preview

## Installation
#### Linux
```sh
wget -qO- https://api.github.com/repos/achannarasappa/sub/releases/latest \
| grep "/sub-linux" \
| cut -d : -f 2,3 | tr -d \" \
| sudo wget -qi - -O /usr/local/bin/sub
sudo chmod +x /usr/local/bin/sub
```
Releases for other operating systems and architectures can be downloaded from [Github Releases](https://github.com/achannarasappa/sub/releases)
#### NPM
```sh
npm install -g subjs
```
#### Docker
```sh
echo "alias sub='docker run -t --rm -v \$PWD:/data achannarasappa/sub:latest \$@'" >> "$HOME/.$(echo $0 | tr -d -)rc"
```
**Note:** With docker, `file_pattern` will be relative to the current directory by default. Alter the `-v` option in the above alias to change behavior.

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