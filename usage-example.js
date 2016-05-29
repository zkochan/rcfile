'use strict'
var rcfile = require('./')

rcfile('eslint')
  .then(function (config) {
    console.log(config)
  })

rcfile('travis', { configFileName: '.travis' })
  .then(function (config) {
    console.log(config)
  })
