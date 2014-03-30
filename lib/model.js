var _ = require('lodash')

var Model = function(attributes) {
  var attrs = attributes || {}
  this.attributes = {}
  this.set(attrs)
  this.initialize.apply(this, arguments)
}

_.extend(Model.prototype, {
  initialize: function(){}

, toJSON: function() {
    return _.clone(this.attributes)
  }  

, get: function(attr) {
   return this.attributes[attr]
  }

, set: function(key, val) {
    var attrs
    if(key == null) return this

    typeof key === "object"
      ? attrs = key
      : (attrs = {})[key] = val

    for(key in attrs) {
      this.attributes[key] = attrs[key]
    }

    return this
  }
})

_.extend(Model, {
  Query: function(query, next) {
    var pg      = require('pg')
      , con     = 'postgres://benyorke:@localhost/progress_dev'
      , model   = this
      , models

    pg.connect(con, function(err, client, done) {
      if(err) return next(err)
      client.query(query, function(err, result) {
        done()
        if(err) return next(err)
        models = _.map(result.rows, function(row) { return new model(row) })
        if(typeof next === 'function') next(null, models)
      })
    })
  }
, Extend: function(staticFunctions, prototypeFunctions) {
    var parent = this
      , child

    if (prototypeFunctions && _.has(prototypeFunctions, 'constructor')) {
      child = prototypeFunctions.constructor
    } else {
      child = function() { return parent.apply(this, arguments) }
    }

    _.extend(child, parent, staticFunctions)

    var Surrogate = function(){ this.constructor = child }
    Surrogate.prototype = parent.prototype
    child.prototype = new Surrogate

    _.extend(child.prototype, prototypeFunctions)

    child.__super__ = parent.prototype

    return child
  }
})

module.exports = Model
