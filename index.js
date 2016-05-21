var init = require('init-package-json')
var assign = require('object-assign')
var defined = require('defined')
var path = require('path')
var npm = require('npm')
var vfs = require('vinyl-fs')

const defaultConfig = require.resolve('./default.js')

function Improv (opt) {
  opt = defined(opt, {})

  var self = this
  var initFile
  var dir = process.cwd()

  var templatesDir = defined(opt.templatesDir, path.join(__dirname, './templates/*'))

  var loadedPromise = new Promise(function (resolve, reject) {
    npm.load(function (err, npm) {
      if (err) {
        return reject(err)
      }

      self.initFile = npm.config.get('init-module')
      self.initFile = defined(self.initFile, defaultConfig)
      self.config = npm.config

      resolve(npm)
    })
  })

  assign(self, {
    initFile,
    dir,
    templatesDir,
    loadedPromise
  })
}

Improv.prototype.loaded = function loaded () {
  return this.loadedPromise
}

Improv.prototype.generate = function generate () {
  // Copy files
  vfs.src(this.templatesDir).pipe(vfs.dest(this.dir))

  this.loaded().then(() => {
    init(this.dir, defaultConfig, this.config, function (err, data) {
      if (err) {
        throw new Error('Err... something went wrong: ' + err)
      }
    })
  })
}

module.exports = Improv
