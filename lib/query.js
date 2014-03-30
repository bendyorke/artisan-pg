module.exports = function(query, next) {
  var pg     = require('pg')
    , con    = 'postgres://benyorke:@localhost/progress_dev'

  pg.connect(con, function(err, client, done) {
    if(err) return next(err)
    client.query(query, function(err, result) {
      done()
      if(err) return next(err)
      next(null, result)
    })
  })
}
