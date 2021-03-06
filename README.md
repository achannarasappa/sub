# sub
[![Build Status](https://travis-ci.org/achannarasappa/sub.svg?branch=master)](https://travis-ci.org/achannarasappa/sub) [![Coverage Status](https://coveralls.io/repos/github/achannarasappa/sub/badge.svg?branch=master)](https://coveralls.io/github/achannarasappa/sub?branch=master) [![](https://images.microbadger.com/badges/version/achannarasappa/sub.svg)](https://microbadger.com/images/achannarasappa/sub) [![npm](https://img.shields.io/npm/v/subjs.svg)](https://www.npmjs.com/package/subjs) [![GitHub release](https://img.shields.io/github/release/achannarasappa/sub.svg)](https://github.com/achannarasappa/sub)

Shell-esque parameter substitution in files from env and stdin replacement sources

## Features
* In-place multi-file edits (like `sed`'s `-i` option)
* Substitution count and preview

## Demo
[![asciicast](https://asciinema.org/a/RseuxPw3PK9wigBLqDffXeEk6.png)](https://asciinema.org/a/RseuxPw3PK9wigBLqDffXeEk6)

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
**Note:** With docker, `file_pattern` will be relative to the current directory by default and prefixed by `/data` (e.g. `sub /data/**/*.json` rather than `sub **/*.json` to substitute in all json files). Alter the `-v` option in the above alias to change behavior.

## Usage
```sh
sub <file_pattern> [options...]

Options:
  -i, --in-place             Edit files in place                [default: false]
  -d, --dry-run              Make no substitution               [default: false]
  -c, --count-substitutions  Output substitution counts         [default: false]
  -v, --version              Show version number                       [boolean]
  -h, --help                 Show help                                 [boolean]

Examples:
  sub **/*.json                    Write replaced text to stdout
  sub **/*.json -i                 Replace files in place
  sub **/*.json -i=.new            Replace in new file with suffix
  echo "A=1\nB=2" | sub **/*.json  Replace from stdin source
```

## Contributions
PRs welcome :)