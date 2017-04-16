'use strict'
var path = require('path')
var debug = require('debug')('rcfile')
var requireUncached = require('require-uncached')
var loadYamlFile = require('load-yaml-file')
var loadJson5File = require('load-json5-file')
var pathExists = require('path-exists')
var objectAssign = require('object-assign')
var keys = require('object-keys')
var emptyConfig = {}

var defaultLoaderByExt = {
  '.js': loadJSConfigFile,
  '.json': loadJSONConfigFile,
  '.yaml': loadYAMLConfigFile,
  '.yml': loadYAMLConfigFile,
}

module.exports = function (pkgName, opts) {
  opts = opts || {}
  var configFileName = opts.configFileName || '.' + pkgName + 'rc'
  var defaultExtension = opts.defaultExtension || '.yml'
  var cwd = opts.cwd || process.cwd()

  var parts = splitPath(cwd)

  var loaderByExt = objectAssign({}, defaultLoaderByExt, {
    '': defaultLoaderByExt[defaultExtension],
  })

  return findConfig(parts)

  function findConfig () {
    var exts = keys(loaderByExt)
    while (exts.length) {
      var ext = exts.shift()
      var configLoc = join(parts, configFileName + ext)
      if (pathExists.sync(configLoc)) {
        return loaderByExt[ext](configLoc)
      }
    }
    var pkgJSONLoc = join(parts, 'package.json')
    if (pathExists.sync(pkgJSONLoc)) {
      var pkgJSON = require(pkgJSONLoc)
      if (pkgJSON[pkgName]) {
        return pkgJSON[pkgName]
      }
    }

    if (parts.pop()) {
      return findConfig()
    }
    return emptyConfig
  }
}

function splitPath (x) {
  return path.resolve(x || '').split(path.sep)
}

function join (parts, filename) {
  return path.resolve(parts.join(path.sep) + path.sep, filename)
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
    return loadJson5File.sync(filePath)
  } catch (e) {
    debug('Error reading JSON file: ' + filePath)
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' + e.message
    throw e
  }
}

function loadYAMLConfigFile (filePath) {
  debug('Loading YAML config file: ' + filePath)

  try {
    // empty YAML file can be null, so always use
    return loadYamlFile.sync(filePath) || {}
  } catch (e) {
    debug('Error reading YAML file: ' + filePath)
    e.message = 'Cannot read config file: ' + filePath + '\nError: ' + e.message
    throw e
  }
}
