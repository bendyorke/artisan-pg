var pg     = require('pg')
  , fs     = require('fs')
  , CONFIG = require('./config.js')

exports.create = function() {
  var conStringGlobal = conString('global')
    , conStringLocal  = conString('development')
    , databaseName    = require(CONFIG.dbConfig).development.database

  pg.connect(conStringGlobal, function(err, client, done) {
    if(err) throw err
    client.query('CREATE DATABASE ' + databaseName, function(err) {
      if(err) throw err
      client.end()
    })
  })
}

exports.drop = function() {
  var conStringGlobal = conString('global')
    , conStringLocal  = conString('development')
    , databaseName    = require(CONFIG.dbConfig).development.database

  pg.connect(conStringGlobal, function(err, client, done) {
    if(err) throw err
    client.query('DROP DATABASE ' + databaseName, function(err) {
      if(err) throw err
      client.end()
    })
  })
}

exports.seed = function() {
  require(CONFIG.seedFiles).seed()
}

exports.migration = function(name) {
  if (!name) throw new Error("A filename is required")
  var timeString = generateTimeString( new Date() )
      filePath   = CONFIG.migrationFiles + name + '_' + timeString + '.js'
   
  fs.writeFile(
    filePath
  , "exports.up = function() {\n\n}\n\nexports.down = function() {\n\n}"
  , function(err) { 
      if (err) throw err 
      console.log("created file:")
      console.log(filePath) 
    }
  )
}

exports.migrate = function(version) {
  if(version && !(parseInt(version) >= 0)) throw new Error("Invalid version number")
  var schema     = fs.existsSync(CONFIG.schemaFile) 
                   ? require(CONFIG.schemaFile)
                   : { version: 0 }
    , direction  = parseInt(version) < schema.version ? 'down' : 'up'
    , argVersion = version ? parseInt(version) : null
    , endVersion = schema.version

  fs
    .readdirSync(CONFIG.migrationFiles)
    .filter(function(file) {
      var number        = migrationNumberOf(file)
        , targetVersion = argVersion !== null ? argVersion : number + 1
      return inRange(number, schema.version, targetVersion)
    })
    .sort(function(a, b) {
      return (direction === 'up'
              ? migrationNumberOf(a) - migrationNumberOf(b)
              : migrationNumberOf(b) - migrationNumberOf(a) )
    })
    .forEach(function(file) {
      endVersion = migrationNumberOf(file)
      require(CONFIG.migrationFiles + file)[direction]()
    })

  fs.writeFileSync(CONFIG.schemaFile, 'exports.version = ' + endVersion)
}

function conString(env) {
  var config = require(CONFIG.dbConfig)[env]
  return 'postgres://'    + 
          config.username + ':' + 
          config.password + '@' + 
          config.hostname + '/' + 
          config.database
}

function generateTimeString( date ) {
  return zeroPad(date.getFullYear()    , 4)
       + zeroPad(date.getMonth() + 1   , 2)
       + zeroPad(date.getDate()        , 2)
       + zeroPad(date.getHours()       , 2)
       + zeroPad(date.getMinutes()     , 2)
       + zeroPad(date.getSeconds()     , 2)
}

function zeroPad(string, length) {
  var padding = new Array(length + 1).join('0')
  return (padding + string).slice(-length)
}

function migrationNumberOf(file) {
  return parseInt( file.slice(file.lastIndexOf('_') + 1, -3) )
}

function inRange(number, boundOne, boundTwo) {
  return (boundOne < boundTwo 
          ? number > boundOne && number <= boundTwo 
          : number <= boundOne && number >= boundTwo)
}
