# rcfile

> Loads library configuration in all possible ways

<!--@shields.flatSquare('npm', 'travis', 'coveralls')-->
[![npm version](https://img.shields.io/npm/v/rcfile.svg?style=flat-square)](https://www.npmjs.com/package/rcfile) [![Build Status](https://img.shields.io/travis/zkochan/rcfile/master.svg?style=flat-square)](https://travis-ci.org/zkochan/rcfile) [![Coverage Status](https://img.shields.io/coveralls/zkochan/rcfile/master.svg?style=flat-square)](https://coveralls.io/r/zkochan/rcfile?branch=master)
<!--/@-->

Read library configurations from `yaml`, `json`, `js` files or from sections in `package.json`.

## Installation

```sh
npm install --save rcfile
```

## Usage

```js
'use strict'
var rcfile = require('rcfile')

console.log(rcfile('eslint'))
//> { extends: 'standard',
//    rules:
//     { 'comma-dangle': [ 2, 'always-multiline' ],
//       'arrow-parens': [ 2, 'as-needed' ] } }

console.log(rcfile('travis', { configFileName: '.travis' }))
//> { language: 'node_js',
//    sudo: false,
//    node_js: [ 'v0.10', 'v4' ],
//    cache: { directories: [ 'node_modules' ] },
//    before_install: [ 'npm install -g npm@3' ],
//    install: [ 'npm install' ],
//    after_success:
//     [ 'if [[ $TRAVIS_NODE_VERSION == "v4" ]]; then npm run coveralls; fi;',
//       'if [[ $TRAVIS_NODE_VERSION == "v4" ]]; then npm run semantic-release; fi;' ] }
```

## License

[MIT](./LICENSE) © [Zoltan Kochan](http://kochan.io)
