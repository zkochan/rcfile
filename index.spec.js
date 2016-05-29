'use strict'
var describe = require('mocha').describe
var it = require('mocha').it
var expect = require('chai').expect

var path = require('path')
var rcfile = require('./')

describe('rcfile', function () {
  it('should read json config in current directory', function () {
    var config = rcfile('foo', {cwd: path.join(process.cwd(), 'fixtures')})
    expect(config).to.eql({foo: 1})
  })

  it('should read json config in parent directory', function () {
    var config = rcfile('foo', {cwd: path.join(process.cwd(), 'fixtures/some-dir')})
    expect(config).to.eql({foo: 1})
  })

  it('should read json config two directories up', function () {
    var config = rcfile('foo', {cwd: path.join(process.cwd(), 'fixtures/some-dir/some-other-dir')})
    expect(config).to.eql({foo: 1})
  })

  it('should read js config in current directory', function () {
    var config = rcfile('bar', {cwd: path.join(process.cwd(), 'fixtures')})
    expect(config).to.eql({bar: 'bar'})
  })

  it('should read yaml config in current directory', function () {
    var config = rcfile('yamlconfig', {cwd: path.join(process.cwd(), 'fixtures')})
    expect(config).to.eql({foo: 'bar'})
  })

  it('should read from package.json if no separate config file found', function () {
    var config = rcfile('qar', {cwd: path.join(process.cwd(), 'fixtures')})
    expect(config).to.eql({qar: 'qar'})
  })

  it('should return empty object if no configuration found', function () {
    var config = rcfile('qarbar', {cwd: path.join(process.cwd(), 'fixtures')})
    expect(config).to.eql({})
  })

  it('should search in current directory by default', function () {
    var config = rcfile('eslint')
    expect(config).to.exist
    expect(config.extends).to.eq('standard')
  })
})
