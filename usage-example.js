'use strict'
var rcfile = require('./')

console.log(rcfile('eslint'))

console.log(rcfile('travis', { configFileName: '.travis' }))
