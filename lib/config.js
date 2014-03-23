var cwd = process.cwd()

module.exports = {
  "dbConfig":       cwd + "/db/config.json"
, "seedFiles":      cwd + "/db/seeds/"
, "migrationFiles": cwd + "/db/migrations/"
, "schemaFile":     cwd + "/db/schema.js"
}
