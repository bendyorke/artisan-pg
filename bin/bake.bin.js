#!/usr/bin/env node
var bakefile = require('../lib/bakefile.js')
  , argv     = process.argv[2]
  , optional = process.argv[3] || null

bakefile[argv](optional)

