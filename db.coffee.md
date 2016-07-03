Databases (server-side)
=======================

    path = require 'path'

    pouchdb = require 'pouchdb'
    Validation = require 'pouchdb-validation'
    QuickSearch = require 'pouchdb-quick-search'
    GeoPouch = require 'geopouch'
    Find = require 'pouchdb-find'

    ###
    lunr = require 'lunr'
    (require 'lunr-languages/lunr.stemmer.support') lunr
    (require 'lunr-languages/lunr.fr') lunr
    ###

    cors = require 'pouchdb-server/lib/cors'
    ExpressPouchDB = require 'express-pouchdb'

    @include = ->

(Relative) filesystem path where to store our local databases.

      databases_dir = @cfg.databases_dir ? 'db/'

FIXME: create the directory (recursively)

      PouchDB = pouchdb.defaults
        prefix: path.join __dirname, databases_dir
      PouchDB.plugin Validation

Quick Search: See https://github.com/nolanlawson/pouchdb-quick-search#api
``` db.search language:'fr', query:'..., fields:[...] ```

      PouchDB.plugin QuickSearch

Geo Pouch: See https://github.com/pouchdb/geopouch#api
``` db.spatial ... ```

      PouchDB.plugin GeoPouch

Find: See https://github.com/nolanlawson/pouchdb-find#api

```
yield db.createIndex index: fields: ['foo']
yield db.find selector: {name:'Mario'}, field:['_id','name'], sort:['name']
```

      PouchDB.plugin Find

URL path prefix to access our local databases (Couchdb uses '', we might use e.g. '/db').

      if @cfg.databases_path?

Install access to our local PouchDB database using a CouchDB-like interface, with CORS and validation.

        pouchDBApp = ExpressPouchDB PouchDB,
          mode: 'minimumForPouchDB'
          overrideMode:
            include: [
              'config-infrastructure'
              'logging-infrastructure'
              'routes/authentication'
              'routes/authorization'
              # 'routes/db-updates' # Not implemented
              'validation'
            ]
        @app.use @cfg.databases_path, cors pouchDBApp.couchConfig
        @app.use @cfg.databases_path, pouchDBApp

Also provide access to the same databases server-side, with validation.

      @db = (name) ->
        db = new PouchDB name
        db.installValidationMethods()
        db
