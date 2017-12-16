## Installation
TBD

## Usage
```sh
sub file_pattern [options]
```
| Option                      | Default |Type              | Description                |
|-----------------------------|:-------:|------------------|----------------------------|
| `-i, --in-place [suffix]`   | `false` | `boolean|string` | Edit files in place        |
| `-d, --dry-run`             | `false` | `boolean`        | Make no substitution       |
| `-c, --count-substitutions` | `false` | `boolean`        | Output substitution counts |
| `-v, --version`             |         |                  | Show version number        |
| `-h, --help`                |         |                  | Show help                  |

## Examples
```sh
echo 'Hello my name is ${USER}\nI live in ${HOME}' > greeting.txt
echo '${USER} speaks ${LANGUAGE}' > language.txt

echo 'USER=rob\nHOME=philadelphia' | sub greeting.txt
# Hello my name is rob
# I live in philadelphia

env | grep 'USER\|LANGUAGE\|HOME'
# USER=ani
# HOME=/home/ani
# LANGUAGE=en_US
sub *.txt -i -c
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