'use strict'
var rcfile = require('../../')

rcfile('foo')
  .then(function (config) {
    console.log(config)
  })
  .catch(function (err) {
    console.error(err)
  })

rcfile('bar')
  .then(function (config) {
    console.log(config)
  })
  .catch(function (err) {
    console.error(err)
  })

rcfile('qar')
  .then(function (config) {
    console.log(config)
  })
  .catch(function (err) {
    console.error(err)
  })
