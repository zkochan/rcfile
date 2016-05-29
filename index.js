'use strict'
var findUpGlob = require('find-up-glob')
var path = require('path')
var debug = require('debug')('rcfile')
var requireUncached = require('require-uncached')
var JSON5 = require('json5')
var fs = require('fs')
var readPkgUp = require('read-pkg-up')
var emptyConfig = {}

module.exports = function (pkgName, opts) {
  opts = opts || {}
  var configFileName = opts.configFileName || '.' + pkgName + 'rc'
  var defaultExtension = opts.defaultExtension || '.yml'
  var cwd = opts.cwd || process.cwd()
  return findUpGlob(configFileName + '?(.{js,json,yml,yaml})', {
    cwd: cwd,
  })
  .then(function (files) {
    if (!files) {
      return readPkgUp({cwd: cwd})
        .then(function (result) {
          return result.pkg[pkgName] || emptyConfig
        })
    }
    return loadConfigFile(files[0], defaultExtension) || emptyConfig
  })
}

function loadConfigFile (filePath, defaultExtension) {
  var fileExtension = path.extname(filePath)
  var ext = ['.js', '.json', '.yaml', '.yml'].indexOf(fileExtension) === -1
    ? defaultExtension
    : fileExtension
  switch (ext) {
    case '.js':
      return loadJSConfigFile(filePath)

    case '.json':
      return loadJSONConfigFile(filePath)

    case '.yaml':
    case '.yml':
      return loadYAMLConfigFile(filePath)
  }
}

function loadJSConfigFile (filePath) {
  debug('Loading JS config file: ' + filePath)
  try {
    return requireUncached(filePath)
  } catch (e) {
    debug('Error reading JavaScript file: ' + filePath)
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' + e.message
    throw e
  }
}

function loadJSONConfigFile (filePath) {
  debug('Loading JSON config file: ' + filePath)

  try {
    return JSON5.parse(readFile(filePath))
  } catch (e) {
    debug('Error reading JSON file: ' + filePath)
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' + e.message
    throw e
  }
}

function readFile (filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function loadYAMLConfigFile (filePath) {
  debug('Loading YAML config file: ' + filePath)

  // lazy load YAML to improve performance when not used
  var yaml = require('js-yaml')

  try {
    // empty YAML file can be null, so always use
    return yaml.safeLoad(readFile(filePath)) || {}
  } catch (e) {
    debug('Error reading YAML file: ' + filePath)
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' + e.message
    throw e
  }
}
