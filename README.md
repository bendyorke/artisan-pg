#artisan-pg
a lighweight wrapper for node-pg.   

_this is a work in progress, do not attempt to use in a production env_

###works out of the box with the following structure
```
+ROOT_DIR
    +node_modules
    +db
        -config.json
        +seeds
            -index.js
        +migrations
            -index.js
```
the location of these files can be changed in /lib/config.js

###currently supports 5 functions

```
bake create
```
creates a db with the name specified in `db/config.json`
```
bake drop
```
drops a db with the name specified in `db/config.json`
```
bake seed
```
runs `db/seeds/index.js#seed`
```
bake migration [filename]
```
creates a migration file in `db/migrations` with the syntax `[filename]_YYYYMMDDHHMMSS.js` containing the code:
```
exports.up = function() {

}

exports.down = function() {

}
```
```
bake migrate [versionNumber - optional]
```
runs a migration from the version specified in `db/schema.js` (defaults to 0 if no file)
runs up or down to the specified version number (runs all the way up if none specified)
saves version number in `db/schema.js`
WARNING: Running this overwrites any content in `db/schema.js` or your specified schemaFile


##examples
###example `db/config.json` file
```
{
  "global": 
  {
    "username": "bendyorke"
  , "password": "artisan-pg"
  , "database": "postgres"
  , "hostname": "localhost"
  }
, "development":
  {
    "username": "bendyorke"
  , "password": "artisan-pg"
  , "database": "progress_dev"
  , "hostname": "localhost"
  }  
}

```
###example `db/seeds/index.js` file
```
exports.seed = function() {
  var fs    = require('fs')
    , path  = require('path')

  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return ( (file.indexOf('.') !== 0) && 
               (file !== 'index.js')     &&
               (file.slice(-3) === '.js')   )
    })
    .forEach(function(file) {
      require(path.join(__dirname, file))()
    })
}
```
